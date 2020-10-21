import styled from 'styled-components';

export const Container = styled.div`
  @media (min-width: 320px) and (max-width: 768px) {
    [class*="MUIDataTableFilterList-root"] {
      margin: 0px 16px 8px 16px !important;
    }
    
    [class*="MUIDataTableToolbar-actions"] {
      text-align: right;
    }
    
    [class*="MUIDataTableSearch-searchText"] {
      flex: 1;
      margin-bottom: 8px;
    }

    .datatables-noprint {
      width: 100% !important;

      &[class*="MUIDataTableBodyCell-cellHide"] {
        display: none !important;
      }
    }
  }
`;
