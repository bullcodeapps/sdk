import React, { useEffect, useState, useCallback } from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import MUIDataTable, { MUIDataTableOptions, MUIDataTableColumnDef, MUIDataTableMeta } from 'mui-datatables';
import { useConfirm } from 'material-ui-confirm';
import {
  Typography, CircularProgress, Box, IconButton, Menu, MenuItem,
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { useDebouncedState } from '../../../core/hooks';

import { Container } from './styles';

export interface DataTableProps {
  title: string;
  options: MUIDataTableOptions;
  columns: DataTableColumn[],
  loading: boolean;
  data: any[];
  count: number;
  searchText: string;
  setSearchText: Function;
  page: number;
  setPage: Function;
  pageSize: number;
  setPageSize: Function;
  order: string;
  setOrder: Function;
  filters?: any;
  setFilters: Function;
  storageKey?: string;
  doDelete?: (...args: any[]) => void;
  onFilterChange?: (filterList: string[][]) => any;

  confirmDeleteMessage?: string;
  searchPlaceholder?: string;
  bodyNoMatchText?: string;
  bodyToolTipText?: string;
  paginationNextText?: string;
  paginationPreviousText?: string;
  paginationRowsPerPageText?: string;
  paginationDisplayRowsText?: string;
  toolbarSearchText?: string;
  toolbarDownloadCsvText?: string;
  toolbarPrintText?: string;
  toolbarViewColumnsText?: string;
  toolbarFilterTableText?: string;
  filterAllText?: string;
  filterTitle?: string;
  filterResetText?: string;
  viewColumnsTitle?: string;
  viewColumnsTitleAria?: string;
  selectedRowsText?: string;
  selectedRowsDeleteText?: string;
  selectedRowsDeleteAriaText?: string;
}

export type DataTableOptions = MUIDataTableOptions;

export interface DataTableAction {
  name: string;
  icon: React.ReactElement;
  handler: (...args: any[]) => void;
  visible?: boolean | ((row: any) => boolean);
}

export interface DataTableColumn {
  name: string;
  label: string;
  filter?: boolean;
  filterList?: any[];
  filterSelectionRender?: (v: any) => string;
  filterNames?: string[];
  sort?: boolean;
  searchable?: boolean;
  customColumnRender?: (v: any, tableMeta: MUIDataTableMeta) => string | React.ReactNode;
  actions?: DataTableAction[];
}

function getSortDirection(currentSort: string, columnName: string) {
  if (currentSort?.replace('-', '') === columnName) {
    const isDesc = currentSort[0] === '-';
    return isDesc ? 'desc' : 'asc';
  }
  return 'none';
}

export default function DataTable({
  title,
  options,
  columns,
  loading,
  data,
  count,
  searchText,
  setSearchText,
  page,
  setPage,
  pageSize,
  setPageSize,
  order,
  setOrder,
  filters,
  setFilters,
  storageKey,
  doDelete,
  onFilterChange,
  confirmDeleteMessage = 'Deseja deletar o(s) item(s) selecionado(s)?',
  searchPlaceholder = 'Digite para pesquisar',
  bodyNoMatchText = 'Desculpe, nenhum resultado encontrado',
  bodyToolTipText = 'Ordenar',
  paginationNextText = 'Próxima página',
  paginationPreviousText = 'Página anterior',
  paginationRowsPerPageText = 'Resultados por página',
  paginationDisplayRowsText = 'de',
  toolbarSearchText = 'Pesquisar',
  toolbarDownloadCsvText = 'Baixar como CSV',
  toolbarPrintText = 'Imprimir',
  toolbarViewColumnsText = 'Exibir/Ocultar colunas',
  toolbarFilterTableText = 'Filtrar resultados',
  filterAllText = 'Todos',
  filterTitle = 'Filtros',
  filterResetText = 'Limpar',
  viewColumnsTitle = 'Exibir colunas',
  viewColumnsTitleAria = 'Exibir/Ocultar colunas',
  selectedRowsText = 'linha(s) selecionada(s)',
  selectedRowsDeleteText = 'Deletar',
  selectedRowsDeleteAriaText = 'Deletar linhas selecionadas',
}: DataTableProps) {
  const confirm = useConfirm();
  const [preparedOptions, setPreparedOptions] = useState({});
  const [preparedColumns, setPreparedColumns] = useState([]);
  const [filterList, setFilterList] = useState<string[][]>();
  const [searchTerm, setSearchTerm] = useState<string>();
  const [anchorEl, setAnchorEl] = useState<Array<HTMLElement>>([]);
  const debouncedSearchTerm = useDebouncedState(searchTerm, 500);

  useEffect(() => {
    setSearchText(searchTerm);
  }, [debouncedSearchTerm]); // eslint-disable-line

  useEffect(() => {
    const pOptions = Object.assign(defaultOptions, options);
    pOptions.onTableChange = (action, tableState) => {
      if (action === 'filterChange'
        || action === 'resetFilters'
        || (action === 'propsUpdate' && !filterList)) {
        setFilterList(tableState.filterList);

        let newFilters: any = {};
        if (onFilterChange) {
          newFilters = onFilterChange(tableState.filterList);
        } else {
          tableState.filterList.forEach((filter, index) => {
            if (filter.length > 0) {
              let valueParsed = null;
              switch (columns[index].name) {
                default:
                  // eslint-disable-next-line prefer-destructuring
                  valueParsed = filter[0];
                  break;
              }
              // eslint-disable-next-line prefer-destructuring
              newFilters[columns[index].name] = valueParsed;
            } else if (newFilters[columns[index].name]) {
              delete newFilters[columns[index].name];
            }
          });
        }
        localStorage.setItem(`${storageKey}-filters`, JSON.stringify(newFilters));
        setFilters(newFilters);
      }

      if (action === 'filterChange' || action === 'resetFilters') {
        setPage(0);
        tableState.page = 0;
      }
    };
    setPreparedOptions(pOptions);
  }, [options]); // eslint-disable-line

  useEffect(() => {
    if (storageKey) {
      if (localStorage.getItem(`${storageKey}-page-size`)) {
        const storagePageSize = parseInt(localStorage.getItem(`${storageKey}-page-size`) || '', 0);
        setPageSize(storagePageSize);
      }
      if (localStorage.getItem(`${storageKey}-order`)) {
        const storageOrder = localStorage.getItem(`${storageKey}-order`) || '';
        setOrder(storageOrder);
      }
      if (localStorage.getItem(`${storageKey}-filters`)) {
        const storageFilters = JSON.parse(localStorage.getItem(`${storageKey}-filters`) || '{}');
        setFilters(storageFilters);
      }
    }
  }, [storageKey]); //  eslint-disable-line

  const actionsColumnRender = useCallback((actions: DataTableAction[]) => (value: any, tableMeta: MUIDataTableMeta) => (
    <>
      <IconButton size="small" onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleClickMenu(event, tableMeta.rowIndex)}>
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl[tableMeta.rowIndex]}
        open={Boolean(anchorEl[tableMeta.rowIndex])}
        onClose={handleCloseMenu}
      >
        {actions.filter((action) => {
          // if visible was not defined we can always show the action
          return [null, undefined].includes(action.visible) ||
            // if visible is a boolean we shall validate it as boolean
            (typeof action.visible === 'boolean' && action.visible !== false) ||
            // if it is a function we must apply and check its return
            (typeof action.visible === 'function' && action.visible(data[tableMeta.rowIndex]) !== false);
        }).map((action: any) => (
          <MenuItem
            key={action.name}
            style={{ justifyContent: 'space-between', minWidth: 150 }}
            onClick={() => {
              action.handler && action.handler(data[tableMeta.rowIndex]);
              setAnchorEl([]);
            }}
          >
            {action.name}
            <span style={{ paddingLeft: 15 }}>{action.icon}</span>
          </MenuItem>
        ))}
      </Menu>
    </>
  ), [anchorEl, data]);

  useEffect(() => {
    if (!columns) {
      return;
    }
    const pColumns: MUIDataTableColumnDef[] = columns.map(({
      name,
      label,
      filter = false,
      filterList: cFilterList,
      filterNames,
      filterSelectionRender,
      sort = true,
      searchable = false,
      customColumnRender,
      actions,
    }) => ({
      name,
      label,
      options: {
        filter,
        filterList: cFilterList,
        customFilterListOptions: {
          render: filterSelectionRender,
        },
        filterOptions: {
          names: filterNames,
        },
        sort,
        sortDirection: getSortDirection(order, name),
        searchable,
        customBodyRender: actions ? actionsColumnRender(actions) : customColumnRender,
      },
    }));
    setPreparedColumns(pColumns);
  }, [actionsColumnRender, columns]); // eslint-disable-line


  const onRowsDelete = (rowsDeleted: any) => {
    confirm({ description: confirmDeleteMessage })
      .then(() => {
        rowsDeleted.data.map(({ dataIndex }: { dataIndex: number }) => doDelete && doDelete(data[dataIndex]));
      })
      .catch();
    return false;
  };

  const onChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const onChangeRowsPerPage = (newPageSize: number) => {
    localStorage.setItem(`${storageKey}-page-size`, newPageSize.toString());
    setPageSize(newPageSize);
    setPage(0);
  };

  const onColumnSortChange = (property: string) => {
    let newOrder = property;
    if (order.replace('-', '') === property) {
      const isDesc = order[0] === '-';
      newOrder = (isDesc ? '' : '-') + property;
    }
    localStorage.setItem(`${storageKey}-order`, newOrder);
    setOrder(newOrder);
  };

  const onSearchChange = (text: string) => setSearchTerm(text);

  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    const an: Array<HTMLElement> = [];
    an[id] = event.currentTarget;
    setAnchorEl(an);
  };

  const handleCloseMenu = () => {
    setAnchorEl([]);
  };

  const defaultOptions: MUIDataTableOptions = {
    filterType: 'dropdown',
    page,
    rowsPerPage: pageSize,
    count,
    serverSide: true,
    pagination: true,
    searchPlaceholder,
    download: false,
    print: false,
    onChangePage,
    onChangeRowsPerPage,
    onColumnSortChange,
    onRowsDelete,
    searchText,
    onSearchChange,
    serverSideFilterList: filterList,
    onTableChange: (action, tableState) => {
      if (action === 'filterChange' || action === 'resetFilters') {
        const newFilters: any = {};
        tableState.filterList.forEach((filter, index) => {
          if (filter.length > 0) {
            // eslint-disable-next-line prefer-destructuring
            newFilters[tableState.columns[index].name] = filter[0];
          } else if (newFilters[tableState.columns[index].name]) {
            delete newFilters[tableState.columns[index].name];
          }
        });
        localStorage.setItem(`${storageKey}-filters`, JSON.stringify(newFilters));
        setFilters(newFilters);
      }
    },
    textLabels: {
      body: {
        noMatch: bodyNoMatchText,
        toolTip: bodyToolTipText,
      },
      pagination: {
        next: paginationNextText,
        previous: paginationPreviousText,
        rowsPerPage: `${paginationRowsPerPageText}:`,
        displayRows: paginationDisplayRowsText,
      },
      toolbar: {
        search: toolbarSearchText,
        downloadCsv: toolbarDownloadCsvText,
        print: toolbarPrintText,
        viewColumns: toolbarViewColumnsText,
        filterTable: toolbarFilterTableText,
      },
      filter: {
        all: filterAllText,
        title: filterTitle,
        reset: filterResetText,
      },
      viewColumns: {
        title: viewColumnsTitle,
        titleAria: viewColumnsTitleAria,
      },
      selectedRows: {
        text: selectedRowsText,
        delete: selectedRowsDeleteText,
        deleteAria: selectedRowsDeleteAriaText,
      },
    },
    customFilterDialogFooter: () => <Box minWidth={320} />, // hack to set the filter dialog width
    responsive: 'stacked',
  };

  const getMuiTheme = createMuiTheme({
    overrides: {
      MuiTableCell: {
        root: {
          '@media (min-width: 320px) and (max-width: 768px)': {
            padding: '6px 16px',
            height: '34px !important',
            textOverflow: 'ellipsis',
            tableLayout: 'fixed',
            overflow: 'hidden',
          },
        },
      },
      MuiIconButton: {
        root: {
          '@media (min-width: 320px) and (max-width: 768px)': {
            padding: '0px 12px !important',
          },
        },
      },
      MuiButton: {
        root: {
          backgroundColor: '#00F2D5 !important',
          color: '#000000 !important',
        },
      },
      MuiGridList: {
        root: {
          flexDirection: 'column',
        },
      },
      MuiGridListTile: {
        root: {
          width: '100% !important',
        },
      },
    },
  });

  return (
    <Container>
      <MuiThemeProvider theme={getMuiTheme}>
        <MUIDataTable
          title={(
            <Typography variant="h6">
              {title}
              {loading && <CircularProgress size={24} style={{ marginLeft: 20, position: 'relative' }} />}
            </Typography>
          )}
          data={data}
          columns={preparedColumns}
          options={{ ...preparedOptions, page, rowsPerPage: pageSize }}
        />
      </MuiThemeProvider>
    </Container>
  );
}
