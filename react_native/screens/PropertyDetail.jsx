import { useState } from "react";
import { useTheme } from "react-native-paper";
import useStyle from "../styles/useStyle";

const PropertyDetail=({route})=>{
    const theme= useTheme();
    const style=useStyle();

    const [loading, setLoading]=useState(false);
    const[refreshing, setRefreshing]=useState(false);

    const [properties, setProperties]= useState([]);
    
}