import React, {useState, useEffect} from 'react';
import { Text, View, Image, TouchableNativeFeedback } from 'react-native';
import styles from "../styles/HomeStyle.js";

export default function NewsItem(props) {

    const [timeString, setTimeString] = useState("");
    var updatedTime = +props.item.updated_date.substring(8, 10);
    var updatedTime2 = +props.item.updated_date.substring(5, 7);    

    function getTimeString(){
        let today = new Date();
        let yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        let date = today.getDate();
        let monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let time = (updatedTime == date) ? "Updated today" :
        (yesterday == updatedTime) ? "Updated yesterday" :
        `Updated on ${updatedTime} ${monthArray[updatedTime2 - 1]}`;
        setTimeString(time);
    }

    useEffect(() => {
        getTimeString();
    });

    return (
        <View style={styles.view_5_A_1}>
        <View style={styles.view_5_A__1AA}>

        <TouchableNativeFeedback
            onPress={() => props.openNew(props.item.url)}
            background={TouchableNativeFeedback.Ripple("#F0EFEFFE", false)}
        >

        <View style={styles.view_5_AA}>

        <View style={styles.view_5_A_2}>
            <Image
            source={{uri: props.item.multimedia[2].url}} 
            style={styles.view_5_A_2_A}
            />
        </View>

        <View style={styles.view_5_A_3}>

            <Text style={styles.view_5_A_3_A}>
            <View>
                <Text style={styles.view_heTxt_2BB}>
                <Text style={styles.view_heTxt_2CC}>
                    {timeString}
                </Text>
                </Text>
            </View>
            </Text>

            <Text style={styles.view_5_A_3_B}>
            {props.item.title}
            </Text>

        </View>
            
        </View>

        </TouchableNativeFeedback>

        </View>
        </View>
    )
}
