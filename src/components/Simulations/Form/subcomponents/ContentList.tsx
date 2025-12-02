import React from 'react';
import { Card, IconButton, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { SimulationContent } from 'utils/interfaces/simulation';

interface ContentListProps {
    items: SimulationContent[];
    onDelete: (name: string) => void;
    onEdit?: (item: SimulationContent) => void;
    disabled: boolean;
}

export const ContentList = ({ items, onDelete, onEdit, disabled }: ContentListProps) => {
    const styles = useStyles2(getStyles);

    if (items.length === 0) {
        return <div className={styles.emptyState}>No content fields added yet.</div>;
    }

    return (
        <div className={styles.listWrapper}>
            {items.map((item) => (
                <Card key={item.name} className={styles.card}>
                    <Card.Heading>{item.name}</Card.Heading>
                    <Card.Meta>
                        {item.type} {item.required ? '(Required)' : ''}
                    </Card.Meta>
                    <Card.SecondaryActions>
                        {onEdit && (
                            <IconButton
                                name="pen"
                                tooltip="Edit"
                                onClick={() => onEdit(item)}
                                disabled={disabled}
                            />
                        )}
                        <IconButton
                            name="trash-alt"
                            tooltip="Delete"
                            onClick={() => onDelete(item.name)}
                            disabled={disabled}
                            variant="destructive"
                        />
                    </Card.SecondaryActions>
                </Card>
            ))}
        </div>
    );
};

const getStyles = (theme: GrafanaTheme2) => ({
    listWrapper: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1)};
  `,
    card: css`
    margin-bottom: 0 !important;
    padding: ${theme.spacing(1)} !important;
  `,
    emptyState: css`
    color: ${theme.colors.text.secondary};
    font-style: italic;
    padding: ${theme.spacing(1)};
  `
});