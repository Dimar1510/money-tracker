// import { _capitalise } from "ag-grid-community";
// import { format } from "date-fns";
// import { useGetAllTransactionsQuery } from "src/app/services/transactionApi";

// interface ISeries {
//   type: "bar";
//   xKey: string;
//   yKey: string;
//   yName: string;
//   stacked?: boolean;
//   normalizedTo?: number;
// }

// interface IMonth {
//   month: string;
//   [key: string]: string | number;
// }

// interface IYear {
//   year: string;
//   months: IMonth[];
//   series: ISeries[];
// }

// let processedDataCache: IYear[] | undefined = undefined;

// export const getProcessedData = () => {
//   const { data: transactions } = useGetAllTransactionsQuery();
//   if (processedDataCache) {
//     return processedDataCache;
//   }

//   if (!transactions || !transactions.totalExpenseByYear) {
//     return;
//   }

//   console.log("calculating");
//   processedDataCache = transactions.totalExpenseByYear.map((year) => {
//     const newYear: IYear = {
//       year: year._id,
//       months: [],
//       series: [],
//     };

//     const seriesMap = new Map<string, boolean>();

//     year.months.forEach((monthItem) => {
//       const monthItemDate = format(new Date(monthItem.month), "LLL");
//       const newMonth: IMonth = {
//         month: monthItemDate,
//         total: monthItem.total,
//       };

//       monthItem.categories.forEach((category) => {
//         newMonth[category.name] = category.total;

//         if (!seriesMap.has(category.name)) {
//           newYear.series.push({
//             type: "bar",
//             xKey: "month",
//             yKey: category.name,
//             yName:
//               category.name === "__other"
//                 ? "Без категории"
//                 : _capitalise(category.name),
//             stacked: true,
//             normalizedTo: 100,
//           });
//           seriesMap.set(category.name, true);
//         }
//       });

//       newYear.months.push(newMonth);
//     });

//     return newYear;
//   });

//   return processedDataCache;
// };
