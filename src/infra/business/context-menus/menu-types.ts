interface Link {
    identifier: string;
    format: 'normal';
    title: string;
}

interface Toggle {
    identifier: string;
    isChecked: boolean;
    format: 'checkbox';
    title: string;
}

export type MenuItem = Link | Toggle;
