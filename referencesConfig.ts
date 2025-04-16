export interface ReferenceConfig {
    name: string;
    path: string;
    displayName: string;
}

export const REFERENCES_CONFIG: ReferenceConfig[] = [
    {
        name: 'disciplines',
        path: '/disciplines',
        displayName: 'Дисциплины'
    },
    {
        name: 'control-types',
        path: '/control-types',
        displayName: 'Виды зачета'
    },
    {
        name: 'department',
        path: '/department',
        displayName: 'Кафедры'
    },
    {
        name: 'activity-type',
        path: '/activity-type',
        displayName: 'Виды занятий'
    },
    {
        name: 'competence',
        path: '/competence',
        displayName: 'Компетенции'
    },
    {
        name: 'competence-code',
        path: '/competence-code',
        displayName: 'Код компетенции'
    },
    {
        name: 'indicator',
        path: '/indicator',
        displayName: 'Индикаторы'
    }
];