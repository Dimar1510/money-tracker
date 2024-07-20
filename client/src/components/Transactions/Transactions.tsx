import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
  Button,
  button,
} from "@nextui-org/react";
import { useGetAllTransactionsQuery } from "src/app/services/transactionApi";
import { useAsyncList } from "@react-stately/data";
import { Transaction } from "src/app/types";
import { MdDeleteOutline, MdOutlineModeEdit } from "react-icons/md";

export default function TransactionsList() {
  const { data } = useGetAllTransactionsQuery();
  const [isLoading, setIsLoading] = useState(true);
  const transactions: Transaction[] = data ? data.transactions : [];

  let list = data
    ? useAsyncList<Transaction, string>({
        load() {
          setIsLoading(false);

          return {
            items: transactions,
          };
        },
        async sort({ items, sortDescriptor }) {
          return {
            items: items.sort((a, b) => {
              let first = a[sortDescriptor.column as keyof typeof a];
              let second = b[sortDescriptor.column as keyof typeof b];
              if (first === undefined || second === undefined) {
                return 0;
              }
              let cmp =
                (parseInt(first as string) || first) <
                (parseInt(second as string) || second)
                  ? -1
                  : 1;

              if (sortDescriptor.direction === "descending") {
                cmp *= -1;
              }

              return cmp;
            }),
          };
        },
      })
    : undefined;

  const renderCell = React.useCallback(
    (transaction: Transaction, columnKey: React.Key) => {
      const cellValue = transaction[columnKey as keyof Transaction];

      switch (columnKey) {
        case "name":
          return (
            <input
              type="text"
              name="name"
              defaultValue={transaction.name}
              className="bg-transparent"
            />
          );

        case "actions":
          return (
            <div className="flex gap-2">
              <button onClick={() => console.log(transaction.id)}>
                <MdDeleteOutline />
              </button>
            </div>
          );
        default:
          return cellValue;
      }
    },
    []
  );
  if (data && list)
    return (
      <Table
        isStriped
        aria-label="All transactions"
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
      >
        <TableHeader>
          <TableColumn key="name" allowsSorting>
            Name
          </TableColumn>
          <TableColumn key="type" allowsSorting>
            Type
          </TableColumn>
          <TableColumn key="date" allowsSorting>
            Date
          </TableColumn>
          <TableColumn key="amount" allowsSorting>
            Amount
          </TableColumn>
          <TableColumn key="category" allowsSorting>
            Category
          </TableColumn>
          <TableColumn key="actions" allowsSorting>
            Actions
          </TableColumn>
        </TableHeader>
        <TableBody
          items={list.items}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
}
