import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

    historyMainContainer: {
        height: '100%',
        backgroundColor: "white",
    },

    history_title_1: {
        display: "flex",
        flexDirection: "row",
        paddingTop: 16,
        paddingBottom: 16,
        height: 54,
        minHeight: 54,
        maxHeight: 54,
    },
    history_title_1A_icon: {
        fontSize: 20,
        color: "#767474FE",
        marginLeft: 20,
        marginRight: 10,
    },
    history_title_1B_txt: {
        color: "#767474FE",
        fontSize: 16,
        fontFamily: "Helvetica",
    },
    history_title_1C_icon: {
        fontSize: 20,
        color: "#767474FE",
        marginRight: 20,
    },
    history1_BB: {
        flexGrow: 1,
    },
    linearGradient_1: {
        minHeight: 4,
    },

    history_style_2: {
        flexGrow: 1,
        backgroundColor: "white",
        paddingTop: 10,
        paddingBottom: 10,
        overflow: "scroll",
    },

    history_style_3: {
        height: 44,
        width: "100%",
        borderTopWidth: 1,
        borderTopColor: "#EFEFF1FE",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    sea_3_item: {
        flex: 1,
    },
    sea3__3_icon: {
        fontSize: 19,
        color: "#767778FE",
        textAlign: "center",
    },
    sea3__3_icon_img: {
        height: 22,
        width: 22,
    },
    sea3__3_icon_r:{
        fontSize: 20,
        color: "#767778FE",
        textAlign: "center",
    },

    his_s22_A: {
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 4,
        overflow: "hidden",
    },
    his_s22_B: {
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 4,
        overflow: "hidden",
        paddingLeft: 10,
    },
    his_s22_C_TXT: {
        fontFamily: "Helvetica",
        fontSize: 14,
        color: "#767474FE",
    },

    modal8: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        height: "auto",
        width: "100%",
        elevation: 8,
  
        // borderRadius: 10,
        // height: "auto",
        // width: "96%",
        // elevation: 4,
        // bottom: 10,
    },
    optionAlertCont_MAIN: {
        paddingTop: 6,
    },
    optionAlertCont_opt_1: {
        paddingTop: 12,
        paddingBottom: 12,
        borderBottomWidth: 1.6,
        borderBottomColor: "#f1f1f1fe",
    },
    optionAlertCont_opt_1_B: {
        paddingTop: 12,
        paddingBottom: 16,
    },
    optionAlertCont_optText_1: {
        color: "#7a7878fe",
        fontSize: 15,
        textAlign: "center",
        display: "flex",
    },
    optionAlertCont_opt_icon_1: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    optionAlertCont_opt_icon_2: {
        color: "#929292fe",
        fontSize: 20,
    },

    history1_INPUT_C: {
        flexGrow: 1,
        marginRight: 10,
    },

    lottieViewContainer: {
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    lottieAnimation: {
        paddingLeft: 16,
        // transform: [
        //     { scale: 1.1 },
        // ]
    },
    lottieText: {
        marginTop: 20,
        color: "#a9a8a8",
        fontSize: 12,
        width: 150,
        textAlign: "center"
    },

});

export default styles;