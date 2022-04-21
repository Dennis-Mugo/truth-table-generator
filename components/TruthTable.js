import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";

function TruthTable({ tableResult }) {
    const [tableObject, tableOrder] = tableResult;
    const [rows, setRows] = useState([]);
    useEffect(() => {
        setRows([]);
        for (let i = 0; i < tableObject[tableOrder[0]].length; i++) {
            let row = [];
            for (let key in tableObject) {
                row.push(tableObject[key][i]);
            }
            setRows(prev => [...prev, row]);
        }

    }, [tableObject])

    const headerStyle = {fontSize: "1rem", fontWeight: "medium", color: "#2196f3", p: 2};

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 250}} size="small" aria-label="a truth table">
        <TableHead>
          <TableRow sx={{overflowX: "scroll" }}>
              {
                  tableOrder.map((key, i) => (<TableCell sx={headerStyle} key={i} align="center">{key}</TableCell>))
              }
            
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow
              key={i}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
                {row.map((truthValue, j) => (<TableCell key={j} align="center">{truthValue}</TableCell>))}
              {/* <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TruthTable;
