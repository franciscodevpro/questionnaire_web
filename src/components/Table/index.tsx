import { ComponentProps } from "react";
import "./styles.css";

type TableProps = {
  columns: string[];
  data: { [key: string]: string | number }[];
  title?: string;
  hideColumns?: boolean;
} & ComponentProps<any>;

export const Table = ({
  hideColumns,
  title,
  columns,
  data,
  ...rest
}: TableProps) => {
  return (
    <table className="table-container" {...rest}>
      <thead>
        {title && (
          <tr>
            <th colSpan={columns.length}>{title}</th>
          </tr>
        )}
        {!hideColumns && (
          <tr>
            {columns.map((elm: string) => (
              <th key={elm}>{elm}</th>
            ))}
          </tr>
        )}
      </thead>
      <tbody>
        {data.map(
          (element: { [key: string]: string | number }, key: number) => (
            <tr key={key}>
              {columns.map((elm: string, k: number) => (
                <td key={k}>{element[elm]}</td>
              ))}
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};
