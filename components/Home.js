import React, { useState, useRef, useEffect } from 'react';
import { StatusBar, SafeAreaView, Text, View, Image, ScrollView, TouchableNativeFeedback, TouchableOpacity, Animated, ActivityIndicator, TextInput, Keyboard, BackHandler, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from "./styles/HomeStyle.js";

import IonicIcon from 'react-native-vector-icons/Ionicons';

import NewsItem from './subComponents/NewsItem';
import SearchItem from './subComponents/SearchItem';

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import Modal from 'react-native-modalbox';
import SpeechToText from 'react-native-google-speech-to-text';

import {useSelector, useDispatch} from 'react-redux';

const Home = ({ navigation, route }) => {

  const styleTypes = ['default','dark-content', 'light-content'];
  const [styleStatusBar, setStyleStatusBar] = useState(styleTypes[1]);
  
  const [rippleOverflow, setRippleOverflow] = useState(false);

  const scrollRef = useRef();
  
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const transformAnim = useRef(new Animated.Value(-16)).current;
  const rotateAnim1 = useRef(new Animated.Value(0)).current;
  const [showMoreStatus, setShowMoreStatus] = useState(false);
  const [showMoreDisp, setShowMoreDisp] = useState(false);

  const [newsData, setNewsData] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const view1marTop1 = useRef(new Animated.Value(0)).current;
  const bottomViewsAll2 = useRef(new Animated.Value(1)).current;
  
  const translY = useRef(new Animated.Value(0)).current;

  const [searchValue, setSearchValue] = useState("");

  const pinsOp1 = useRef(new Animated.Value(0.8)).current;

  const [pin1, setPin1] = useState(" ~https://www.youtube.com/~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294282/youtube_hbg408.png");
  const [pin2, setPin2] = useState(" ~https://www.wikipedia.org/~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294281/wikipedia_rfho3x.png");
  const [pin3, setPin3] = useState(" ~https://twitter.com/explore~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294281/twitter_swc5mx.png");
  const [pin4, setPin4] = useState(" ~https://www.quora.com/~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294281/quora_qglhgp.png");

  const [pin5, setPin5] = useState(" ~https://www.amazon.in/~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294289/amazon_msmuqy.png");
  const [pin6, setPin6] = useState(" ~https://edition.cnn.com/~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294289/CNN_attiju.png");
  const [pin7, setPin7] = useState(" ~https://www.instagram.com/?hl=en~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294281/instagram_zjam2e.png");
  const [pin8, setPin8] = useState("false/AddNew/ID84422");

  const [pinsReady, setPinsReady] = useState(false);

  const searchItemsBBo2 = useRef(new Animated.Value(0)).current;
  const [searchItems, setSearchItems] = useState([]);

  const [lastSearchedWeb, setLastSearchedWeb] = useState(false);

  const [pinAlertOpen, setPinAlertOpen] = useState(false);
  const [optionsAlertOpen, setOptionsAlertOpen] = useState(false);

  const [EBName, setEBName] = useState("");
  const [EBUrl, setEBUrl] = useState("");

  const [currentClickedPin, setCurrentClickedPin] = useState(8);

  const adOpacity = useRef(new Animated.Value(0)).current;
  const adTransY = useRef(new Animated.Value(-10)).current;

  const [adVisible, setAdVisible] = useState(false);
  const [adInfo, setAdInfo] = useState({
    title: "",
    description: "",
    imageUrl: "",
    urlTarget: "new",
    url: "",
    time: ""
  });

  const appInfo = useSelector((state) => state.appInfo);

  const dispatch = useDispatch();

  const getAppInfo = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("appInfo");
      if(jsonValue !== null) {
        const value = JSON.parse(jsonValue);
        dispatch({type: "CHANGE_APPINFO", value: value});
      }
    } catch (error) {
      // error
    }
  }

  useEffect(() => {

    fetch('https://turbo-browser-api.netlify.app/adInfo.json')
    .then(
      (response) => response.json()
    )
    .then(
      (data) => {
        if(data.visible == "true"){
          setAdVisible(true);
          Animated.timing(
            adOpacity,
            {
              toValue: 1,
              duration: appInfo.animations == false ? 0 : 400,
              useNativeDriver: true,
            }
          ).start();
          Animated.timing(
            adTransY,
            {
              toValue: 0,
              duration: appInfo.animations == false ? 0 : 400,
              useNativeDriver: true,
            }
          ).start();
        } else {
          setAdVisible(false);
        }
        setAdInfo({
          title: data.title,
          description: data.adDescription,
          imageUrl: data.imageURL,
          urlTarget: data.urlTarget,
          url: data.url,
          time: data.time
        });
      }
    );

  }, []);

  const speechToTextHandler = async () => {
    let speechToTextData = null;
    try {
      speechToTextData = await SpeechToText.startSpeech('Try saying something', 'en_IN');
      searchString(speechToTextData);

    } catch (error) {
      // error
    }
  }

  Array.prototype.insert = function ( index, item ) {
    this.splice( index, 0, item );
  };

  const spin = rotateAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  const scrollToTop = () => {
    scrollRef.current.scrollTo({
        y: 0,
        animated: appInfo.animations,
    });
  }

  const storeData1 = async (key, value) => {
    try {
      // saving data
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // error
      return false;
    }
  }

  const storeData2 = async (key, value) => {
    try {
      // saving data
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // error
      return false;
    }
  }

  const getAndStoreSearch = async (v2S) => {
    try {
      const value = await AsyncStorage.getItem("searchItems");
      if(value !== null) {
        // value previously stored
        let parsedValue = JSON.parse(value);
        let newValue = {
          key: uuidv4(),
          item: v2S
        };
        parsedValue.insert(0, newValue);
        // let newValue2 = parsedValue.splice(0, 0,newValue)
        let val2StoreA = JSON.stringify(parsedValue);
        storeData2("searchItems", val2StoreA);
      } else {
        let val2StoreB = JSON.stringify([{
          key: uuidv4(),
          item: v2S
        }]);
        storeData2("searchItems", val2StoreB);
      }
    } catch(e) {
      // error reading value
    }
  }

  const getData1 = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if(value == "true"){

        // Get Pins from storage and fill their states
        const p1 = await AsyncStorage.getItem("pin1");
        const p2 = await AsyncStorage.getItem("pin2");
        const p3 = await AsyncStorage.getItem("pin3");
        const p4 = await AsyncStorage.getItem("pin4");

        const p5 = await AsyncStorage.getItem("pin5");
        const p6 = await AsyncStorage.getItem("pin6");
        const p7 = await AsyncStorage.getItem("pin7");
        const p8 = await AsyncStorage.getItem("pin8");

        setPin1(p1);
        setPin2(p2);
        setPin3(p3);
        setPin4(p4);

        setPin5(p5);
        setPin6(p6);
        setPin7(p7);
        setPin8(p8);

        setPinsReady(true);
        Animated.timing(
          pinsOp1,
          {
            toValue: 1,
            duration: appInfo.animations == false ? 0 : 200,
            useNativeDriver: true,
          }
        ).start();

      } else {

        // First time app is being opened
        // Store the pins

        storeData1("pin1", "YouTube~https://www.youtube.com/~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294282/youtube_hbg408.png");
        storeData1("pin2", "Wikipedia~https://www.wikipedia.org/~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294281/wikipedia_rfho3x.png");
        storeData1("pin3", "Twitter~https://twitter.com/explore~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294281/twitter_swc5mx.png");
        storeData1("pin4", "Quora~https://www.quora.com/~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294281/quora_qglhgp.png");

        storeData1("pin5", "Amazon~https://www.amazon.in/~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294289/amazon_msmuqy.png");
        storeData1("pin6", "CNN~https://edition.cnn.com/~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294289/CNN_attiju.png");
        storeData1("pin7", "Instagram~https://www.instagram.com/?hl=en~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294281/instagram_zjam2e.png");
        storeData1("pin8", "false/AddNew/ID84422");

        storeData1("inApp", "true");

        storeData1("appInfo", JSON.stringify({
          searchEngine: "Google",
          animations: true,
          animationDirection: true,
          disableCookies: false,
          disableJS: false
        }));

        // Get Pins from storage and fill their states
        const p1 = await AsyncStorage.getItem("pin1");
        const p2 = await AsyncStorage.getItem("pin2");
        const p3 = await AsyncStorage.getItem("pin3");
        const p4 = await AsyncStorage.getItem("pin4");

        const p5 = await AsyncStorage.getItem("pin5");
        const p6 = await AsyncStorage.getItem("pin6");
        const p7 = await AsyncStorage.getItem("pin7");
        const p8 = await AsyncStorage.getItem("pin8");

        setPin1(p1);
        setPin2(p2);
        setPin3(p3);
        setPin4(p4);

        setPin5(p5);
        setPin6(p6);
        setPin7(p7);
        setPin8(p8);

        setPinsReady(true);
        Animated.timing(
          pinsOp1,
          {
            toValue: 1,
            duration: appInfo.animations == false ? 0 : 200,
            useNativeDriver: true,
          }
        ).start();

      }
    } catch(e) {
      // error
    }
  }

  const getData2 = async () => {
    try {
      const value = await AsyncStorage.getItem("searchItems");
      if(value !== null) {
        // value previously stored
        let gotValue = JSON.parse(value);
        setSearchItems(gotValue);
      }
    } catch(e) {
      // error reading value
    }
  }

  const getData4 = async () => {
    try {
      const value = await AsyncStorage.getItem("lastSearchedWeb");
      if(value !== null) {
        // value previously stored
        setLastSearchedWeb(JSON.parse(value));
      }
    } catch(e) {
      // error
    }
  }

  useEffect(() => {
    getData1("inApp");
  }, []);

  useEffect(() => {
    getAppInfo();
    navigation.addListener('focus',
      () => {
        // getData1("inApp");
        // AsyncStorage.clear();
        setLastSearchedWeb(false);
        setSearchItems(false);
        // getAppInfo();
      }
    );
  }, [])

  function showMoreClick(){

    if(showMoreStatus == false){

      setShowMoreDisp(true);
      Animated.timing(
        fadeAnim1,
        {
          toValue: 1,
          duration: appInfo.animations == false ? 0 : 200,
          useNativeDriver: true,
        }
      ).start();
      setShowMoreStatus(true);
      Animated.timing(
        transformAnim,
        {
          toValue: 0,
          duration: appInfo.animations == false ? 0 : 200,
          useNativeDriver: true,
        }
      ).start();
      Animated.timing(
        rotateAnim1,
        {
          toValue: 1,
          duration: appInfo.animations == false ? 0 : 200,
          useNativeDriver: true,
        }
      ).start();

      if(newsData  == false){

        fetch("https://api.nytimes.com/svc/topstories/v2/home.json?api-key=S54qP2LGkkPqRMJNbH3GhacbATsuLsh7", {
          method: 'get',
        })
        .then(response => {
          return response.json();
        })
        .then(json => {
          if(json.status == "OK"){
            setNewsData(json);
          }
        })
        .catch(error => {
          // Close ShowMore
          Animated.timing(
            fadeAnim1,
            {
              toValue: 0,
              duration: appInfo.animations == false ? 0 : 200,
              useNativeDriver: true,
            }
          ).start();
          setShowMoreStatus(false);
          Animated.timing(
            transformAnim,
            {
              toValue: -16,
              duration: appInfo.animations == false ? 0 : 200,
              useNativeDriver: true,
            }
          ).start();
          Animated.timing(
            rotateAnim1,
            {
              toValue: 0,
              duration: appInfo.animations == false ? 0 : 200,
              useNativeDriver: true,
            }
          ).start();
        });

      } else {
        
      }

    } else {

      Animated.timing(
        fadeAnim1,
        {
          toValue: 0,
          duration: appInfo.animations == false ? 0 : 200,
          useNativeDriver: true,
        }
      ).start();
      setShowMoreStatus(false);
      Animated.timing(
        transformAnim,
        {
          toValue: -16,
          duration: appInfo.animations == false ? 0 : 200,
          useNativeDriver: true,
        }
      ).start();
      Animated.timing(
        rotateAnim1,
        {
          toValue: 0,
          duration: appInfo.animations == false ? 0 : 200,
          useNativeDriver: true,
        }
      ).start();

      scrollToTop();
      setTimeout(() => {
        setShowMoreDisp(false);
      }, 200);

    }

  }

  const searchBarClicked1 = () => {
    setSearchValue("");
    setSearchOpen(true);
    scrollToTop();
    Animated.timing(
      translY,
      {
        toValue: -170,
        duration: appInfo.animations == false ? 0 : 200,
        useNativeDriver: true,
      }
    ).start();
    Animated.timing(
      bottomViewsAll2,
      {
        toValue: 0,
        duration: appInfo.animations == false ? 0 : 200,
        useNativeDriver: true,
      }
    ).start();
    setTimeout(() => {
      Animated.timing(
        searchItemsBBo2,
        {
          toValue: 1,
          duration: appInfo.animations == false ? 0 : 400,
          useNativeDriver: true,
        }
      ).start();
    }, 200);
    setTimeout(() => {
      getData4();
      getData2();
    }, 200);
  }

  Keyboard.addListener("keyboardDidHide", function(){
    // closeSearchBtn();
  });

  const closeSearchBtn = () => {
    setSearchOpen(false);
    Animated.timing(
      translY,
      {
        toValue: 0,
        duration: appInfo.animations == false ? 0 : 200,
        useNativeDriver: true,
      }
    ).start();
    Animated.timing(
      bottomViewsAll2,
      {
        toValue: 1,
        duration: appInfo.animations == false ? 0 : 200,
        useNativeDriver: true,
      }
    ).start();
    Animated.timing(
      searchItemsBBo2,
      {
        toValue: 0,
        duration: appInfo.animations == false ? 0 : 400,
        useNativeDriver: true,
      }
    ).start();
  }

  const openWebsite = (url) => {
    
    navigation.navigate('Search', { name: `turbo/${url}` });  

    setTimeout(() => {
      setSearchOpen(false);
      Animated.timing(
        translY,
        {
          toValue: 0,
          duration: appInfo.animations == false ? 0 : 150,
          useNativeDriver: true,
        }
      ).start();
      Animated.timing(
        bottomViewsAll2,
        {
          toValue: 1,
          duration: appInfo.animations == false ? 0 : 200,
          useNativeDriver: true,
        }
      ).start();
    }, 400);
    
  }

  const onSearchChangeText = (text) => {
    setSearchValue(text);
  }

  const onEditBChangeName = (text) => {
    setEBName(text);
  }

  const onEditBChangeURL = (text) => {
    setEBUrl(text);
  }

  const voiceSearchBtnClk = () => {
    speechToTextHandler();
  }

  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem("lastSearchedWeb");
      setLastSearchedWeb(false);
    } catch(e) {
      // error
    }
  }

  const deleteLastSearchWeb = () => {
    removeValue();
  }

  const openNews = (url) => {
    openWebsite(url);
  }

  const showMoreBtnClk = () => {
    openWebsite("https://news.google.com/");
  }

  const searchString = (string) => {

    if(string == ""){

    } else if (string.substring(0, 8) == "https://" || string.substring(0, 7) == "http://") {
      if(string.includes("~")){
        openWebsite(string);
      } else {
        openWebsite(string);
        setTimeout(() => {
          getAndStoreSearch(string);
        }, 400);
      }
    } else {

      if(string.includes("~")){
        if(appInfo.searchEngine == "Google"){
          openWebsite("https://www.google.com/search?q=" + string.replace(/ /g,"+"));
        } else if (appInfo.searchEngine == "DuckDuckGo") {
          openWebsite("https://duckduckgo.com/?q=" + string.replace(/ /g,"+"));
        } else if (appInfo.searchEngine == "Bing") {
          openWebsite("https://www.bing.com/search?q=" + string.replace(/ /g,"+"));
        } else if (appInfo.searchEngine == "Yahoo!") {
          openWebsite("https://in.search.yahoo.com/search?p=" + string.replace(/ /g,"+"));
        } else {
          openWebsite("https://www.google.com/search?q=" + string.replace(/ /g,"+"));
        }
      } else {
        if(appInfo.searchEngine == "Google"){
          openWebsite("https://www.google.com/search?q=" + string.replace(/ /g,"+"));
        } else if (appInfo.searchEngine == "DuckDuckGo") {
          openWebsite("https://duckduckgo.com/?q=" + string.replace(/ /g,"+"));
        } else if (appInfo.searchEngine == "Bing") {
          openWebsite("https://www.bing.com/search?q=" + string.replace(/ /g,"+"));
        } else if (appInfo.searchEngine == "Yahoo!") {
          openWebsite("https://in.search.yahoo.com/search?p=" + string.replace(/ /g,"+"));
        } else {
          openWebsite("https://www.google.com/search?q=" + string.replace(/ /g,"+"));
        }
        setTimeout(() => {
          getAndStoreSearch(string);
        }, 400);
      }

    }

  }

  const openOutlineHandle = (string) => {
    setSearchValue(string);
  }

  const openWebsiteHandle = (string) => {
    searchString(string);
  }

  const showAlert1 = (id) => {
    setCurrentClickedPin(id);
    setPinAlertOpen(true);
  }

  const savePIN = async (pinToSet) => {
    if(
      EBName.includes("~") ||
      EBUrl.includes("~") ||
      EBName.trim() == "" ||
      EBUrl.trim() == ""
    ){
      // Do nothing
    } else {
      try {
        // ;-;
        storeData1("pin" + pinToSet, EBName.trim() + "~" + EBUrl.trim() + "~" + "https://api.statvoo.com/favicon/?url=" + EBUrl.trim());
        if (pinToSet == "1") {
          setPin1(EBName.trim() + "~" + EBUrl.trim() + "~" + "https://api.statvoo.com/favicon/?url=" + EBUrl.trim());
        } else if(pinToSet == "2") {
          setPin2(EBName.trim() + "~" + EBUrl.trim() + "~" + "https://api.statvoo.com/favicon/?url=" + EBUrl.trim());
        } else if(pinToSet == "3") {
          setPin3(EBName.trim() + "~" + EBUrl + "~" + "https://api.statvoo.com/favicon/?url=" + EBUrl.trim());
        } else if(pinToSet == "4") {
          setPin4(EBName.trim() + "~" + EBUrl + "~" + "https://api.statvoo.com/favicon/?url=" + EBUrl.trim());
        } else if(pinToSet == "5") {
          setPin5(EBName.trim() + "~" + EBUrl + "~" + "https://api.statvoo.com/favicon/?url=" + EBUrl.trim());
        } else if(pinToSet == "6") {
          setPin6(EBName.trim() + "~" + EBUrl + "~" + "https://api.statvoo.com/favicon/?url=" + EBUrl.trim());
        } else if(pinToSet == "7") {
          setPin7(EBName.trim() + "~" + EBUrl + "~" + "https://api.statvoo.com/favicon/?url=" + EBUrl.trim());
        } else if(pinToSet == "8") {
          setPin8(EBName.trim() + "~" + EBUrl + "~" + "https://api.statvoo.com/favicon/?url=" + EBUrl.trim());
        } else {
          setPin8(EBName.trim() + "~" + EBUrl.trim() + "~" + "https://api.statvoo.com/favicon/?url=" + EBUrl.trim());
        }
        setPinAlertOpen(false);
        setEBName("");
        setEBUrl("");
      } catch (error) {
        // error
      }
    }
  }

  return(
    <SafeAreaView>

    <StatusBar backgroundColor="#ffffff" barStyle={styleStatusBar} />

    <Modal
      isOpen={optionsAlertOpen} 
      onClosed={() => {setOptionsAlertOpen(false)}} 
      style={[styles.modal, styles.modal8]} 
      position={"bottom"} 
      backdropPressToClose={true} 
      swipeToClose={false}
      backdropOpacity={0.2} 
      backButtonClose={true}
      coverScreen={true} 
      animationDuration={appInfo.animations == false ? 0 : 200}
    >
      <View style={styles.optionAlertCont_MAIN}>

      <View style={styles.optionAlertCont_opt_1}>
          <TouchableOpacity onPress={() => {
            setOptionsAlertOpen(false);
            navigation.navigate('Incognito', { name: "Home" });
          }}>
            <Text style={styles.optionAlertCont_optText_1}>
              Go Incognito
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionAlertCont_opt_1}>
          <TouchableOpacity onPress={() => {
            setOptionsAlertOpen(false);
            navigation.navigate('Bookmarks', { name: "Home" });
          }}>
            <Text style={styles.optionAlertCont_optText_1}>
              Bookmarks
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionAlertCont_opt_1}>
          <TouchableOpacity onPress={() => {
            setOptionsAlertOpen(false);
            navigation.navigate('History', { name: "Home" });
          }}>
            <Text style={styles.optionAlertCont_optText_1}>
              History
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionAlertCont_opt_1}>
          <TouchableOpacity onPress={() => {
            setOptionsAlertOpen(false);
            navigation.navigate('Settings', { name: "Home" });
          }}>
            <Text style={styles.optionAlertCont_optText_1}>
              Settings
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionAlertCont_opt_1}>
          <TouchableOpacity onPress={() => {
            setOptionsAlertOpen(false);
            openWebsite("https://turbo-browser.netlify.app/privacy-policy.html");
          }}>
            <Text style={styles.optionAlertCont_optText_1}>
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionAlertCont_opt_1}>
          <TouchableOpacity onPress={() => {
            setOptionsAlertOpen(false);
            navigation.navigate('Help', { name: "Home" });
          }}>
            <Text style={styles.optionAlertCont_optText_1}>
              FAQs
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionAlertCont_opt_1_B}>
          <TouchableOpacity onPress={() => {
            BackHandler.exitApp();
          }}>
            <Text style={styles.optionAlertCont_optText_1}>
              Exit App
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.optionAlertCont_opt_icon_1}>
          <TouchableOpacity style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 10,
            marginBottom: 4,
          }} onPress={() => {setOptionsAlertOpen(false)}}>
            {/* <FontAwesome style={styles.optionAlertCont_opt_icon_2} name="chevron-down"/> */}
            <Image 
              source={require("../assets/arrowDown2.png")} 
              style={{
                height: 26,
                width: 26,
              }}
            />
          </TouchableOpacity>
        </View>
        
      </View>
    </Modal>

    <Modal 
      isOpen={pinAlertOpen} 
      onClosed={() => {setPinAlertOpen(false)}} 
      style={[styles.modal, styles.modal4]} 
      position={"center"} 
      backdropPressToClose={true} 
      swipeToClose={false} 
      backdropOpacity={0.2} 
      backButtonClose={true} 
      coverScreen={true} 
      animationDuration={appInfo.animations == false ? 0 : 200}
    >

    {/* <StatusBar backgroundColor="#CCCCCCFF" barStyle={styleStatusBar} /> */}

      <View style={styles.pinAlertCont_MAIN}>

        <View style={styles.pinAlertContAA}>

          <View style={styles.pinAlertCont1_1}>
            <IonicIcon name="bookmark" style={styles.pinAlertCont1_1_icon}/>
          </View>
          <View style={styles.pinAlertCont1_2}>
            <Text style={styles.pinAlertCont1_2_txt}>Edit Bookmark</Text>
          </View>
          <View style={styles.pinAlertCont1_3}>
          <View
              style={{
                borderRadius: 18,
                overflow: "hidden",
              }}>
            <TouchableOpacity onPress={() => {setPinAlertOpen(false)}}>
              <View style={styles.pinAlertCont1_3_ripple}>
                <IonicIcon name="close" style={styles.pinAlertCont1_3_icon}/>
              </View>
            </TouchableOpacity>
            </View>
          </View>

        </View>

        <View style={styles.pinAlertContBB}>
          <View style={styles.pinAlertCont1_B_1}>
            <Text style={styles.pinAlertCont1_B_1_TXT}>Name</Text>
          </View>
          <View style={styles.pinAlertCont1_B_2}>
            <TextInput
              style={{
                fontSize: 14,
                color: "#888787FE",
                marginLeft: 8,
                fontFamily: "Helvetica",
                flexGrow: 1,
                borderWidth: 1.6,
                borderRadius: 4,
                borderColor: "#D2CECEFE",
                paddingLeft: 8,
                paddingTop: 6,
                paddingBottom: 6,
              }}
              value={EBName}
              onChangeText={(text) => onEditBChangeName(text)}
              editable={true}
              placeholder="Enter Name"
              placeholderTextColor="#C7C3C3FE"
            />
          </View>
        </View>

        <View style={styles.pinAlertContCC}>
          <View style={styles.pinAlertCont1_C_1}>
            <Text style={styles.pinAlertCont1_B_2_TXT}>URL</Text>
          </View>
          <View style={styles.pinAlertCont1_C_2}>
            <TextInput
              style={{
                fontSize: 14,
                color: "#888787FE",
                marginLeft: 8,
                fontFamily: "Helvetica",
                flexGrow: 1,
                borderWidth: 1.6,
                borderRadius: 4,
                borderColor: "#D2CECEFE",
                paddingLeft: 8,
                paddingTop: 6,
                paddingBottom: 6,
              }}
              value={EBUrl}
              onChangeText={(text) => onEditBChangeURL(text)}
              editable={true}
              placeholder="Enter URL"
              placeholderTextColor="#C7C3C3FE"
            />
          </View>
        </View>

        <View style={styles.pinAlertContDD}>

          <View style={styles.pinAlertCont1_D_1}>
          <TouchableOpacity onPress={() => {setPinAlertOpen(false)}}>
            <Text style={styles.pinAlertCont1_D_1_TXT}>Cancel</Text>
          </TouchableOpacity>
          </View>
          <View style={styles.pinAlertCont1_D_2}>
          <TouchableOpacity onPress={() => {
            savePIN(currentClickedPin);
          }}>
            <Text style={
              EBName.length || EBUrl.length > 0 ?
              styles.pinAlertCont1_D_2_TXT_HIG
              : styles.pinAlertCont1_D_2_TXT
            }>Save</Text>
          </TouchableOpacity>
        </View>

      </View>

      </View>

    </Modal>

    <ScrollView ref={scrollRef} style={styles.scrollView} scrollEnabled={!searchOpen} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'} scrollEventThrottle={1}>

    <Animated.View
      style={{
        translateY: translY
      }}
    >

      {/* View 1 */}
      <Animated.View
        style={{
          marginTop: view1marTop1
        }}
      >
      <View style={styles.view__1}>
        {
          appInfo.searchEngine == "Google" ? 
          <>
            <Image 
            source={require("../assets/googleIcon.png")} 
            style={{ resizeMode: 'contain', width: 32, height: 32 }}
            />
          </> : <></>
        }
        {
          appInfo.searchEngine == "DuckDuckGo" ? 
          <>
            <Image 
            source={require("../assets/duckDuckGoIcon.png")} 
            style={{ resizeMode: 'contain', width: 32, height: 32 }}
            />
          </> : <></>
        }
        {
          appInfo.searchEngine == "Bing" ? 
          <>
            <Image 
            source={require("../assets/bingIcon.png")} 
            style={{ resizeMode: 'contain', width: 32, height: 32 }}
            />
          </> : <></>
        }
        {
          appInfo.searchEngine == "Yahoo!" ? 
          <>
            <Image 
            source={require("../assets/YahooIcon.png")} 
            style={{ resizeMode: 'contain', width: 32, height: 32 }}
            />
          </> : <></>
        }
        {/* <Image
          source={require('../assets/googleIcon.png')} 
          style={{ resizeMode: 'contain', width: 32, height: 32 }}
        /> */}
      </View>
      </Animated.View>

      <View style={{
        position: "absolute",
        right: 20,
        top: 20,
        height: 32,
        width: 32,
        backgroundColor: "#F5F5F5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 32
      }}>
      <TouchableOpacity onPressIn={() => {
        setOptionsAlertOpen(true);
      }}>
        <View style={{
          height: 32,
          width: 32,
          backgroundColor: "#F5F5F5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 32
        }}>
          <IonicIcon style={{
            color: "#8F8D8DFE",
            fontSize: 16,
          }} name="ellipsis-vertical"/>
        </View>
      </TouchableOpacity>
      </View>

      {/* View 2 */}
      <View style={styles.view__2}>

        <View style={{borderRadius: 40, overflow: 'hidden'}}>

        <TouchableOpacity
          onPress={searchBarClicked1}
          style={{width: "100%"}}
        >

        <View style={styles.view_input_c_1}>

          {
            searchOpen
            ?
            <IonicIcon onPress={closeSearchBtn} style={styles.search_icon} name="arrow-back"/>
            :
            <IonicIcon style={styles.search_icon} name="search"/>
          }

          {
            searchOpen ?
            <TextInput 
              style={{
                fontSize: 14,
                color: "#5B5D5DFF",
                marginLeft: 8,
                fontFamily: "Helvetica",
                flexGrow: 1,
              }}
              value={searchValue}
              onChangeText={(text) => onSearchChangeText(text)}
              autoFocus={true}
              editable={searchOpen}
              onSubmitEditing={() => searchString(searchValue)}
              placeholderTextColor="#CECFCFFF"
            />
            :
            <Text style={styles.search_text}>Search {appInfo.searchEngine.replace("!", "")}</Text>
          }
          {/* setSearchValue */}
          { searchOpen ?
          ((searchValue.length > 0) ? <IonicIcon onPress={() => setSearchValue("")} style={styles.mic_icon} name="close"/> : <IonicIcon onPress={voiceSearchBtnClk} style={styles.mic_icon} name="mic"/>)
          :
          <IonicIcon onPress={voiceSearchBtnClk} style={styles.mic_icon} name="mic"/>
          }

        </View>

        </TouchableOpacity>

        </View>

      </View>

      {/* Search */}

      <Animated.View
        style={{
          opacity: searchItemsBBo2,
        }}
      >

      {
        searchOpen ? 
        <View style={styles.searchItemsBB_1}>

          {
            lastSearchedWeb == false || searchValue !== "" ?
            <></> :
            <View style={styles.searchItemsBB_CON_1}>
              <View>
                <IonicIcon style={styles.searchItemsBB_1_A} name="globe-outline"/>
              </View>
              <View style={styles.searchItemsBB_1_B_CON}>
                <TouchableOpacity onPress={() => {openWebsite(lastSearchedWeb.url)}}>
                  <View>
                    <Text style={styles.searchItemsBB_1_B}>
                      {lastSearchedWeb.name.length > 26 ? lastSearchedWeb.name.substring(0, 24) + "..." : lastSearchedWeb.name}
                    </Text>
                    <Text style={styles.searchItemsBB_1_B__2}>
                    {lastSearchedWeb.url.length > 38 ? lastSearchedWeb.url.substring(0, 36) + "..." : lastSearchedWeb.url}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
              <TouchableOpacity onPress={deleteLastSearchWeb}>
                <IonicIcon style={styles.searchItemsBB_1_C} name="trash-outline"/>
              </TouchableOpacity>
              </View>
            </View>
          }

          {
            searchItems == "" ? <></> :
            <>
              {
                searchValue !== "" ?
                <></> :
                <Text style={styles.searchHeadingB_1}>SEARCH HISTORY</Text>
              }
              <SearchItem searchValue={searchValue} searchItems={searchItems} openOutlineHandle={openOutlineHandle} openWebsiteHandle={openWebsiteHandle}/>
            </>
          }

        </View>
        :
          <></>
      }

      </Animated.View>

      <Animated.View
        style={{
          opacity: bottomViewsAll2
        }}
      >

      {/* This part became a little messed up ;-; */}

      {
      !pinsReady ? 

      <View>
      {/* View 3 */}
      <View style={styles.view_3}>

      <View style={styles.view_3_item_c}>
      <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("#FFFFFFFF", rippleOverflow)}
      >
      <View style={styles.view_3_imgc1}>
      </View>
      </TouchableNativeFeedback>
      <Text style={styles.view_3_item_txt}> </Text>
      </View>

      <View style={styles.view_3_item_c}>
      <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("#FFFFFFFF", rippleOverflow)}
      >
      <View style={styles.view_3_imgc1}>
      </View>
      </TouchableNativeFeedback>
      <Text style={styles.view_3_item_txt}> </Text>
      </View>

      <View style={styles.view_3_item_c}>
      <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("#FFFFFFFF", rippleOverflow)}
      >
      <View style={styles.view_3_imgc1}>
      </View>
      </TouchableNativeFeedback>
      <Text style={styles.view_3_item_txt}> </Text>
      </View>

      <View style={styles.view_3_item_c}>
      <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("#FFFFFFFF", rippleOverflow)}
      >
      <View style={styles.view_3_imgc1}>
      </View>
      </TouchableNativeFeedback>
      <Text style={styles.view_3_item_txt}> </Text>
      </View>

      </View>

      {/* View 4 */}
      <View style={styles.view_4}>

      <View style={styles.view_3_item_c}>
      <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("#FFFFFFFF", rippleOverflow)}
      >
      <View style={styles.view_3_imgc1}>
      </View>
      </TouchableNativeFeedback>
      <Text style={styles.view_3_item_txt}> </Text>
      </View>

      <View style={styles.view_3_item_c}>
      <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("#FFFFFFFF", rippleOverflow)}
      >
      <View style={styles.view_3_imgc1}>
      </View>
      </TouchableNativeFeedback>
      <Text style={styles.view_3_item_txt}> </Text>
      </View>

      <View style={styles.view_3_item_c}>
      <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("#FFFFFFFF", rippleOverflow)}
      >
      <View style={styles.view_3_imgc1}>
      </View>
      </TouchableNativeFeedback>
      <Text style={styles.view_3_item_txt}> </Text>
      </View>

      <View style={styles.view_3_item_c}>
      <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("#FFFFFFFF", rippleOverflow)}
      >
      <View style={styles.view_3_imgc1}>
      </View>
      </TouchableNativeFeedback>
      <Text style={styles.view_3_item_txt}> </Text>
      </View>

      </View>
      </View>

      :

      <View>
      <Animated.View
      style={{
      opacity: pinsOp1
      }}
      >
      {/* View 3 */}
      <View style={styles.view_3}>

      <View style={styles.view_3_item_c}>
      <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("#FFFFFFFF", rippleOverflow)}
      onPress={() => {openWebsite(pin1.split("~")[1])}}
      onLongPress={() => {
        setEBName(pin1.split("~")[0]);
        setEBUrl(pin1.split("~")[1]);
        showAlert1("1");
      }}
      >
      <View style={styles.view_3_imgc1}>
      <Image 
        source={{uri: pin1.split("~")[2]}} 
        style={styles.view_item_img}
      />
      </View>
      </TouchableNativeFeedback>
      <Text style={styles.view_3_item_txt}>{pin1.split("~")[0]}</Text>
      </View>

      <View style={styles.view_3_item_c}>
      <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("#FFFFFFFF", rippleOverflow)}
      onPress={() => {openWebsite(pin2.split("~")[1])}}
      onLongPress={() => {
        setEBName(pin2.split("~")[0]);
        setEBUrl(pin2.split("~")[1]);
        showAlert1("2");
      }}
      >
      <View style={styles.view_3_imgc1}>
      <Image 
      source={{uri: pin2.split("~")[2]}}
      style={styles.view_item_img}
      />
      </View>
      </TouchableNativeFeedback>
      <Text style={styles.view_3_item_txt}>{pin2.split("~")[0]}</Text>
      </View>

      <View style={styles.view_3_item_c}>
      <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("#FFFFFFFF", rippleOverflow)}
      onPress={() => {openWebsite(pin3.split("~")[1])}}
      onLongPress={() => {
        setEBName(pin3.split("~")[0]);
        setEBUrl(pin3.split("~")[1]);
        showAlert1("3");
      }}
      >
      <View style={styles.view_3_imgc1}>
      <Image 
      source={{uri: pin3.split("~")[2]}}
      style={styles.view_item_img}
      />
      </View>
      </TouchableNativeFeedback>
      <Text style={styles.view_3_item_txt}>{pin3.split("~")[0]}</Text>
      </View>

      <View style={styles.view_3_item_c}>
      <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("#FFFFFFFF", rippleOverflow)}
      onPress={() => {openWebsite(pin4.split("~")[1])}}
      onLongPress={() => {
        setEBName(pin4.split("~")[0]);
        setEBUrl(pin4.split("~")[1]);
        showAlert1("4");
      }}
      >
      <View style={styles.view_3_imgc1}>
      <Image 
      source={{uri: pin4.split("~")[2]}}
      style={styles.view_item_img}
      />
      </View>
      </TouchableNativeFeedback>
      <Text style={styles.view_3_item_txt}>{pin4.split("~")[0]}</Text>
      </View>

      </View>

      {/* View 4 */}
      <View style={styles.view_4}>

      <View style={styles.view_3_item_c}>
      <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("#FFFFFFFF", rippleOverflow)}
      onPress={() => {openWebsite(pin5.split("~")[1])}}
      onLongPress={() => {
        setEBName(pin5.split("~")[0]);
        setEBUrl(pin5.split("~")[1]);
        showAlert1("5");
      }}
      >
      <View style={styles.view_3_imgc1}>
      <Image 
      source={{uri: pin5.split("~")[2]}}
      style={styles.view_item_img}
      />
      </View>
      </TouchableNativeFeedback>
      <Text style={styles.view_3_item_txt}>{pin5.split("~")[0]}</Text>
      </View>

      <View style={styles.view_3_item_c}>
      <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("#FFFFFFFF", rippleOverflow)}
      onPress={() => {openWebsite(pin6.split("~")[1])}}
      onLongPress={() => {
        setEBName(pin6.split("~")[0]);
        setEBUrl(pin6.split("~")[1]);
        showAlert1("6");
      }}
      >
      <View style={styles.view_3_imgc1}>
      <Image 
      source={{uri: pin6.split("~")[2]}}
      style={styles.view_item_img}
      />
      </View>
      </TouchableNativeFeedback>
      <Text style={styles.view_3_item_txt}>{pin6.split("~")[0]}</Text>
      </View>

      <View style={styles.view_3_item_c}>
      <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("#FFFFFFFF", rippleOverflow)}
      onPress={() => {openWebsite(pin7.split("~")[1])}}
      onLongPress={() => {
        setEBName(pin7.split("~")[0]);
        setEBUrl(pin7.split("~")[1]);
        showAlert1("7");
      }}
      >
      <View style={styles.view_3_imgc1}>
      <Image 
      source={{uri: pin7.split("~")[2]}}
      style={styles.view_item_img}
      />
      </View>
      </TouchableNativeFeedback>
      <Text style={styles.view_3_item_txt}>{pin7.split("~")[0]}</Text>
      </View>

      <View style={styles.view_3_item_c}>
      <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("#FFFFFFFF", rippleOverflow)}
      onLongPress={() => {
        if(pin8 !== "false/AddNew/ID84422"){
          setEBName(pin8.split("~")[0]);
          setEBUrl(pin8.split("~")[1]);
        } else {
          setEBName("");
          setEBUrl("");
        }
        showAlert1("8");
      }}
      onPress={() => {
        if(pin8 == "false/AddNew/ID84422"){
          setEBName("");
          setEBUrl("");
          showAlert1("8");
        } else {
          openWebsite(pin8.split("~")[1]);
        }
      }}
      >
      
      {
        pin8 == "false/AddNew/ID84422" ?
        <View style={styles.view_3_imgc1}>
        <IonicIcon style={{color: "#929292FF", fontSize: 24}} name="add"/>
        </View>
        :
        <View style={styles.view_3_imgc1}>
        <Image 
        source={{uri: pin8.split("~")[2]}}
        style={styles.view_item_img}
        />
        </View>
      }
      
      </TouchableNativeFeedback>
      <Text style={styles.view_3_item_txt}>
        {(pin8 == "false/AddNew/ID84422") ? "Add New" : pin8.split("~")[0]}
      </Text>
      </View>

      </View>
      </Animated.View>
      </View>
      }
      
      {/* View AD */}
      {
        adVisible ?
        <Animated.View
          style={{
            opacity: adOpacity,
            translateY: adTransY
          }}
        >
        <View style={styles.view_5_A__1AA__2}>
        <TouchableNativeFeedback
          onPress={() => {
            if(adInfo.urlTarget == "new") {
              Linking.openURL(adInfo.url);
            } else {
              openWebsite(adInfo.url);
            }
          }}
          background={TouchableNativeFeedback.Ripple("#F0EFEFFE", false)}
        >

        <View style={styles.view_5_AA}>

        <View style={styles.view_5_A_2}>
            <Image
            source={{uri: adInfo.imageUrl}} 
            style={styles.view_5_A_2_A}
            />
        </View>

        <View style={styles.view_5_A_3}>

            <Text style={styles.view_5_A_3_A}>
            <View>
                <Text style={styles.view_heTxt_2BB}>
                <Text style={styles.view_heTxt_2CC}>
                    {adInfo.title}
                </Text>
                </Text>
            </View>
            </Text>

            <Text style={styles.view_5_A_3_B}>
              {adInfo.description}
            </Text>

        </View>
            
        </View>

        </TouchableNativeFeedback>
        </View>
        </Animated.View>
        :
        <></>
      }

      {/* View 5 */}
      <View style={styles.view_5}>
          <View style={styles.view_5_ic_1}>
              <TouchableNativeFeedback
                onPress={showMoreClick}
                background={TouchableNativeFeedback.Ripple("#d1d3d6", rippleOverflow)}
              >
              <View style={styles.view_5_ic_2}>
              <Text style={styles.view_5_txt}>
                Show more
              </Text>
              <Animated.View
                style={{
                  transform: [{rotate: spin}],
                }}
              ><IonicIcon style={styles.view_5_icon} name="chevron-down"/></Animated.View>
              </View>
              </TouchableNativeFeedback>
          </View>
      </View>
      
      {showMoreDisp ?
        <View>
        <Animated.View
          style={{
            opacity: fadeAnim1,
            translateY: transformAnim,
          }}
        >
          {newsData ?
            <View>
              <NewsItem openNew={openNews} item={newsData.results[0]}/>
              <NewsItem openNew={openNews} item={newsData.results[1]}/>
              <NewsItem openNew={openNews} item={newsData.results[2]}/>
              <NewsItem openNew={openNews} item={newsData.results[3]}/>
              <NewsItem openNew={openNews} item={newsData.results[4]}/>
              <NewsItem openNew={openNews} item={newsData.results[5]}/>
              <TouchableOpacity
                onPress={showMoreBtnClk}
              >
              <View style={styles.browserMore__1}>
                <Text style={styles.browserMore__2}>Browse More</Text>
              </View>
              </TouchableOpacity>
            </View>
          :
          <View style={styles.loaderContainerAA}>
            <ActivityIndicator color={'#8F8D8DFE'} />
          </View>
          }
        </Animated.View>
        </View>
      : <View></View>
      }

      </Animated.View>

    </Animated.View>

    </ScrollView>

    </SafeAreaView>
  )

}

export default Home;