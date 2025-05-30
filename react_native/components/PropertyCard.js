import { useNavigation } from "@react-navigation/native";
import { Card, useTheme } from "react-native-paper";
import useStyle from "../styles/useStyle";
import Carousel from "./Carousel";



const PropertyCard=({id,images,name,address   })=>{
    const style = useStyle();
    const theme = useTheme();

    const navigation = useNavigation();
    const toPropertyDetail=()=>{
        navigation.navigate("propertyDetail",{"id":id,"name":name});
    }

    
    
    return (
        <Card
            style={style.card}
        >
            <Card.Content>
                {images&&<Carousel images={images}/>}
            </Card.Content>


        </Card>
    )
};

export default PropertyCard;