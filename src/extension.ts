import * as vscode from 'vscode';
import { XmlCompleteSettings, XmlSchemaPropertiesArray } from './types';
import XmlLinterProvider from './linterprovider';
import XmlCompletionItemProvider from './completionitemprovider';
import XmlFormatProvider from './formatprovider';
import XmlRangeFormatProvider from './rangeformatprovider';
import AutoCompletionProvider from './autocompletionprovider';
import XmlHoverProvider from './hoverprovider';
import XmlDefinitionProvider from './definitionprovider';
import XmlDefinitionContentProvider from './definitioncontentprovider';

export declare let globalSettings: XmlCompleteSettings;

export const languageId: string = 'xml';

export const schemaId: string = 'xml2xsd-definition-provider';

export function activate(context: vscode.ExtensionContext) {

	vscode.workspace.onDidChangeConfiguration(loadConfiguration, undefined, context.subscriptions);
	loadConfiguration();

	const schemaPropertiesArray = new XmlSchemaPropertiesArray();
	let completionitemprovider = vscode.languages.registerCompletionItemProvider(
		{ language: languageId, scheme: 'file' },
		new XmlCompletionItemProvider(context, schemaPropertiesArray));

	let formatprovider = vscode.languages.registerDocumentFormattingEditProvider(
		{ language: languageId, scheme: 'file' },
		new XmlFormatProvider(context, schemaPropertiesArray));

	let rangeformatprovider = vscode.languages.registerDocumentRangeFormattingEditProvider(
		{ language: languageId, scheme: 'file' },
		new XmlRangeFormatProvider(context, schemaPropertiesArray));

	let hoverprovider = vscode.languages.registerHoverProvider(
		{ language: languageId, scheme: 'file' },
		new XmlHoverProvider(context, schemaPropertiesArray));

	let definitionprovider = vscode.languages.registerDefinitionProvider(
			{ language: languageId, scheme: 'file' },
			new XmlDefinitionProvider(context, schemaPropertiesArray));

	let linterprovider = new XmlLinterProvider(context, schemaPropertiesArray);

	let autocompletionprovider = new AutoCompletionProvider(context, schemaPropertiesArray);

	let definitioncontentprovider = vscode.workspace.registerTextDocumentContentProvider(schemaId, new XmlDefinitionContentProvider(context, schemaPropertiesArray));

	context.subscriptions.push(
		completionitemprovider,
		formatprovider,
		rangeformatprovider,
		hoverprovider,
		definitionprovider,
		linterprovider,
		autocompletionprovider,
		definitioncontentprovider);
}

function loadConfiguration(): void {
	const section = vscode.workspace.getConfiguration('xmlComplete', null);
	globalSettings = new XmlCompleteSettings();
	globalSettings.schemaMapping = section.get('schemaMapping', []);
	globalSettings.formattingStyle = section.get('formattingStyle', "singleLineAttributes");
}

export function deactivate() { }
