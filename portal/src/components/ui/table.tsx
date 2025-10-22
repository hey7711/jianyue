import * as React from "react";
import { cn } from "@/lib/utils";

// --- (新增) 定义变体 Props ---
interface TableVariantProps {
  showBorder?: boolean;
  striped?: boolean;
  headerBg?: boolean;
}

// --- (修改) Table 组件接受并传递变体 Props ---
interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    TableVariantProps {}

const TableContext = React.createContext<TableVariantProps>({});

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      showBorder = false,
      striped = false,
      headerBg = true, // 默认开启表头背景
      ...props
    },
    ref
  ) => (
    // 使用 Context Provider 传递 props
    <TableContext.Provider value={{ showBorder, striped, headerBg }}>
      <div className="relative w-full overflow-x-auto border rounded-md">
        {/* 添加外边框和圆角 */}
        <table
          ref={ref}
          className={cn(
            "w-full caption-bottom text-sm",
            // 可选：如果 showBorder 为 true，给 table 添加一个 border-collapse?
            // showBorder && "border-collapse",
            className
          )}
          {...props}
        />
      </div>
    </TableContext.Provider>
  )
);
Table.displayName = "Table";

// --- (修改) TableHeader 使用 Context ---
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  const { headerBg } = React.useContext(TableContext);
  return (
    <thead
      ref={ref}
      className={cn(headerBg && "bg-secondary", className)}
      {...props}
    />
  );
});
TableHeader.displayName = "TableHeader";

// --- (修改) TableBody 使用 Context ---
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  const { striped } = React.useContext(TableContext);
  return (
    <tbody
      ref={ref}
      className={cn(
        "[&_tr:last-child]:border-0", 
        // 斑马纹样式
        striped && "[&_tr:nth-child(even)]:bg-muted/25",
        className
      )}
      {...props}
    />
  );
});
TableBody.displayName = "TableBody";

// --- TableFooter (可选，通常页脚不需要斑马纹或列边框) ---
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", 
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

// --- (修改) TableRow 处理表头背景和边框 ---
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          "border-b transition-colors hover:bg-secondary data-[state=selected]:bg-muted", 
          className
        )}
        {...props}
      />
    );
  }
);
TableRow.displayName = "TableRow";

// --- (修改) TableHead 处理列边框 ---
interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => {
    const { showBorder } = React.useContext(TableContext);
    return (
      <th
        ref={ref}
        className={cn(
          // 保持我们之前的定制：h-12 px-4 py-3
          "h-12 px-4 py-3 text-left align-middle font-medium text-muted-foreground whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
          // 列边框样式 (最后一列除外)
          showBorder && "border-r last:border-r-0",
          className
        )}
        {...props}
      />
    );
  }
);
TableHead.displayName = "TableHead";

// --- (修改) TableCell 处理列边框 ---
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => {
    const { showBorder } = React.useContext(TableContext);
    return (
      <td
        ref={ref}
        className={cn(
          // 保持我们之前的定制：px-4 py-3
          "px-4 py-3 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
          // 列边框样式 (最后一列除外)
          showBorder && "border-r last:border-r-0",
          className
        )}
        {...props}
      />
    );
  }
);
TableCell.displayName = "TableCell";

// TableCaption 保持不变
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)} 
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
