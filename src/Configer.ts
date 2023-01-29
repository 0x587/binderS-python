import { posix } from 'path';
import * as vscode from 'vscode';

export interface ConfigSchema {
    /**
     * List of data sources. Corresponding database table structure.
     */
    sources: SourceSchema[];
}
// Data source.
export interface SourceSchema {
    /**
     * A list of columns for the data source.
     */
    columns: ColumnSchema[];
    /**
     * Name of data source.
     */
    name: string;
    /**
     * A list of data sources to which this data source is connected.
     */
    relationship?: ConnectedRelationSchema[];
}
// Column of data source.
export interface ColumnSchema {
    /**
     * Whether the column is an index column.
     */
    indexed?: boolean;
    /**
     * Name of column.
     */
    name: string;
    /**
     * The size of column, just use in string.
     */
    size?: number;
    /**
     * Type of column.
     */
    type: "datetime" | "float" | "int" | "string";
    /**
     * Whether the value of the column is unique.
     */
    unique?: boolean;
}
export interface ConnectedRelationSchema {
    /**
     * The relationship to the link target.
     */
    mapping: "n-n" | "1-1" | "1-n";
    /**
     * Link target identifier.
     */
    name: string;
    /**
     * An identifier reflected to the target data source that cannot duplicate the column name
     * of the target data source.
     */
    reflect?: string;
    /**
     * The name of the link target, which must be the name of the available data source.
     */
    target: string;
}

export class Configer {

    static async load() {
        if (!vscode.workspace.workspaceFolders) {
            vscode.window.showErrorMessage('No folder or workspace opened');
            return;
        }
        const folderUri = vscode.workspace.workspaceFolders[0].uri;
        const configFileUri = folderUri.with({ path: posix.join(folderUri.path, 'binder.json') });
        try {
            const configData = await vscode.workspace.fs.readFile(configFileUri);
            return JSON.parse(Buffer.from(configData).toString('utf8')) as ConfigSchema;
        } catch (error) {
            vscode.window.showErrorMessage("Failed to read the configuration file.");
        }
    }

    private sources = [];
    constructor(private config: ConfigSchema) {
        this.parse();
    }

    private parse() {
        // Check the uniqueness of the data source name and column name
        const sourceNames = new Set<string>();
        const columnNames = new Map<string, Set<string>>();
        for (const source of this.config.sources) {
            if (sourceNames.has(source.name)) {
                return vscode.window.showErrorMessage(`Duplicate data source name: ${source.name}`);
            }
            sourceNames.add(source.name);
            columnNames.set(source.name, new Set<string>());
            for (const column of source.columns) {
                if (columnNames.get(source.name)!.has(column.name)) {
                    return vscode.window.showErrorMessage(`"Duplicate column name:{ ${source.name}.${column.name}}`);
                }
                columnNames.get(source.name)!.add(column.name);
            }
        }
        // Check the reflect
        for (const source of this.config.sources) {
            if (source.relationship) {
                for (const relationship of source.relationship) {
                    if (columnNames.get(source.name)!.has(relationship.name)) {
                        return vscode.window.showErrorMessage(`The relationship {${source.name}.${relationship.name}->\
                        ${relationship.target}.${relationship.reflect}} conflicts with {${source.name}.${relationship.name}}.`);
                    }
                    const targetColumnNames = columnNames.get(relationship.target);
                    if (!targetColumnNames) {
                        return vscode.window.showErrorMessage(`Can't find target data source of relationship \
                        {${source.name}.${relationship.name}->${relationship.target}.${relationship.reflect}}`);
                    }
                    if (relationship.reflect && targetColumnNames.has(relationship.reflect)) {
                        return vscode.window.showErrorMessage(`The relationship {${source.name}.${relationship.name}->\
                        ${relationship.target}.${relationship.reflect}} conflicts with the {${relationship.target}.${relationship.reflect}}`);
                    }
                }
            }
        }
    }
}