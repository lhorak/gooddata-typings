export namespace AFM {
    export interface IExecution {
        execution: {
            afm: IAfm;
            resultSpec?: IResultSpec;
        };
    }

    export interface IAfm {
        attributes?: IAttribute[];
        measures?: IMeasure[];
        filters?: CompatibilityFilter[];
        nativeTotals?: INativeTotalItem[];
    }

    export interface IResultSpec {
        dimensions?: IDimension[];
        sorts?: SortItem[];
    }

    export interface IAttribute {
        localIdentifier: Identifier;
        displayForm: ObjQualifier;
        alias?: string;
    }

    export interface IMeasure {
        localIdentifier: Identifier;
        definition: ISimpleMeasureDefinition | IPopMeasureDefinition;
        alias?: string;
        format?: string;
    }

    export interface ISimpleMeasureDefinition {
        measure: ISimpleMeasure;
    }

    export interface IPopMeasureDefinition {
        popMeasure: IPopMeasure;
    }

    export interface ISimpleMeasure {
        item: ObjQualifier;
        aggregation?: 'sum' | 'count' | 'avg' | 'min' | 'max' | 'median' | 'runsum';
        filters?: FilterItem[];
        computeRatio?: boolean;
    }

    export interface IPopMeasure {
        measureIdentifier: Identifier;
        popAttribute: ObjQualifier;
    }

    // ObjQualifier type
    export type Identifier = string;
    export type ObjQualifier = IObjUriQualifier | IObjIdentifierQualifier;

    export interface IObjIdentifierQualifier {
        identifier: string;
    }

    export interface IObjUriQualifier {
        uri: string;
    }

    // Filter types and interfaces
    export type CompatibilityFilter = IExpressionFilter | FilterItem;
    export type FilterItem = DateFilterItem | AttributeFilterItem;
    export type AttributeFilterItem = IPositiveAttributeFilter | INegativeAttributeFilter;
    export type DateFilterItem = IAbsoluteDateFilter | IRelativeDateFilter;

    export interface IPositiveAttributeFilter {
        positiveAttributeFilter: {
            displayForm: ObjQualifier;
            in: string[];
        };
    }

    export interface INegativeAttributeFilter {
        negativeAttributeFilter: {
            displayForm: ObjQualifier;
            notIn: string[];
        };
    }

    export interface IAbsoluteDateFilter {
        absoluteDateFilter: {
            dataSet: ObjQualifier;
            from: string;
            to: string;
        };
    }

    export interface IRelativeDateFilter {
        relativeDateFilter: {
            dataSet: ObjQualifier;
            granularity: string;
            from: number;
            to: number;
        };
    }

    // Might be removed, as we don't know if expression filter is needed
    export interface IExpressionFilter {
        value: string;
    }

    export interface ITotalItem {
        measureIdentifier: Identifier;
        type: TotalType;
        attributeIdentifier: Identifier;
    }

    export type TotalType = 'sum' | 'avg' | 'max' | 'min' | 'nat' | 'med';

    export interface INativeTotalItem {
        measureIdentifier: Identifier;
        attributeIdentifiers: Identifier[];
    }

    export interface IDimension {
        itemIdentifiers: Identifier[];
        totals?: ITotalItem[];
    }

    export type SortItem = IAttributeSortItem | IMeasureSortItem;
    export type SortDirection = 'asc' | 'desc';

    export interface IAttributeSortItem {
        attributeSortItem: {
            direction: SortDirection;
            attributeIdentifier: Identifier;
        };
    }

    export interface IMeasureSortItem {
        measureSortItem: {
            direction: SortDirection;
            locators: LocatorItem[];
        };
    }

    export type LocatorItem = IAttributeLocatorItem | IMeasureLocatorItem;

    export interface IAttributeLocatorItem {
        attributeLocatorItem: {
            attributeIdentifier: Identifier,
            element: string;
        };
    }

    export interface IMeasureLocatorItem {
        measureLocatorItem: {
            measureIdentifier: Identifier;
        };
    }

    export function isObjectUriQualifier(qualifier: AFM.ObjQualifier): qualifier is AFM.IObjUriQualifier {
        return !!(qualifier as AFM.IObjUriQualifier).uri;
    }

    export function isSimpleMeasureDefinition(
        definition: AFM.ISimpleMeasureDefinition | AFM.IPopMeasureDefinition
    ): definition is AFM.ISimpleMeasureDefinition {
        return !!(definition as AFM.ISimpleMeasureDefinition).measure;
    }

    export function isAttributeSortItem(sortItem: AFM.SortItem): sortItem is AFM.IAttributeSortItem {
        return !!(sortItem as AFM.IAttributeSortItem).attributeSortItem;
    }

    export function isMeasureSortItem(sortItem: AFM.SortItem): sortItem is AFM.IMeasureSortItem {
        return !!(sortItem as AFM.IMeasureSortItem).measureSortItem;
    }
}

export namespace Execution {
    export interface IMeasureHeaderItem {
        measureHeaderItem: {
            uri?: string;
            identifier?: string;
            localIdentifier: string;
            name: string;
            format: string;
        }
    }

    export interface IMeasureGroupHeader {
        measureGroupHeader: {
            items: IMeasureHeaderItem[];
            totalItems?: ITotalHeaderItem[];
        }
    }

    export interface ITotalHeaderItem {
        totalHeaderItem: {
            name: string;
        }
    }

    export interface IAttributeHeaderItem {
        attributeHeaderItem: {
            uri: string;
            name: string;
        }
    }

    export interface IAttributeHeader {
        attributeHeader: {
            uri: string;
            identifier: string;
            localIdentifier: string;
            name: string;
            totalItems?: ITotalHeaderItem[];
        }
    }

    export type Header = IMeasureGroupHeader | IAttributeHeader;

    export interface IResultDimension {
        headers: Header[];
    }

    export interface IExecutionResponse {
        executionResponse: {
            links: {
                executionResult: string;
            };
            dimensions: IResultDimension[];
        }
    }

    export type DataValue = null | string | number;

    export interface IExecutionResult {
        executionResult: {
            attributeHeaderItems?: IAttributeHeaderItem[][][];
            data: DataValue[][] | DataValue[];
            totals?: DataValue[][][];
            paging: {
                count: number[];
                offset: number[];
                total: number[];
            };
        }
    }

    export interface IError {
        code: number;
        message?: string;
    }

    export interface IExecutionResponses {
        executionResponse: IExecutionResponse;
        executionResult: IExecutionResult;
    }

    export type AfmExecutionResponse = IExecutionResponses | IError;
}