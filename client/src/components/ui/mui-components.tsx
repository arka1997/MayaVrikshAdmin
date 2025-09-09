import { forwardRef } from 'react';
import {
  Button as MuiButton,
  TextField as MuiTextField,
  Select as MuiSelect,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Autocomplete,
  Box,
  Typography,
  IconButton,
  Switch,
  FormControlLabel,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader as MuiCardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Badge,
  Skeleton,
  Alert,
  Snackbar,
  CircularProgress,
  Grid,
  Divider,
} from '@mui/material';

// Re-export MUI components with custom styling
export const Button = forwardRef<HTMLButtonElement, any>((props, ref) => (
  <MuiButton ref={ref} {...props} />
));

export const TextField = forwardRef<HTMLDivElement, any>((props, ref) => (
  <MuiTextField ref={ref} {...props} />
));

export const Select = forwardRef<HTMLDivElement, any>((props, ref) => (
  <MuiSelect ref={ref} {...props} />
));

export const Card = forwardRef<HTMLDivElement, any>((props, ref) => (
  <MuiCard ref={ref} {...props} />
));

export const CardContent = forwardRef<HTMLDivElement, any>((props, ref) => (
  <MuiCardContent ref={ref} {...props} />
));

export const CardHeader = forwardRef<HTMLDivElement, any>((props, ref) => (
  <MuiCardHeader ref={ref} {...props} />
));

export {
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Autocomplete,
  Box,
  Typography,
  IconButton,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Badge,
  Skeleton,
  Alert,
  Snackbar,
  CircularProgress,
  Grid,
  Divider,
};
