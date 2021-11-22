import {
  CardChannelGrid,
  CardSlide,
  CategoryList,
  CardReport06,
  News43,
  Price2Col,
  Icon,
  PlaceholderLine,
  Placeholder,
  NewsList,
  SafeAreaView,
  Text,
  Transaction2Col,
} from '@components';
import {BaseColor, BaseStyle, useTheme} from '@config';
import {
  HomeChannelData,
  HomeListData,
  HomePopularData,
  HomeTopicData,
  PostListData,
} from '@data';
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  ScrollView,
  View,
  Image,
  Animated,
  ImageBackground,
  RefreshControl,
  Button,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import getUser from '../../selectors/UserSelectors';
import HeaderCard from './HeaderCard';
import HeaderHome from './HeaderHome';
import styles from './styles';
import Swiper from 'react-native-swiper';
import Categories from './Categories';
import axios from 'axios';
import * as Utils from '@utils';
import numFormat from '../../components/numFormat';
// import {NotificationHandlers} from '../../components/NotificationHandler';
import PushNotification from 'react-native-push-notification';
// import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {notifikasi} from '../../components/NotificationHandler';
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Home = props => {
  const {navigation} = props;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [topics, setTopics] = useState(HomeTopicData);
  const [channels, setChannels] = useState(HomeChannelData);
  const [popular, setPopular] = useState(HomePopularData);
  const [list, setList] = useState(HomeListData);
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => getUser(state));
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const scrollY = useRef(new Animated.Value(0)).current;
  const [getDataDue, setDataDue] = useState([]);
  const [hasError, setErrors] = useState(false);
  const [data, setData] = useState([]);

  const [configureToken, setConfigureToken] = useState();

  const [refreshing, setRefreshing] = useState(false);

  // const [notifhand, setnotifhand] = useState(NotificationHandlers().onRegister);

  // console.log('NotificationHandler.token--->', NotificationHandlers());

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    axios
      .get('http://34.87.121.155:8000/ifcaprop-api/api/about/01/01')
      .then(({data}) => {
        console.log('data', data[0]);
        setData(data[0].images);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      // configure_notif();
      // setSpinner(false);
    }, 3000);
  }, []);

  const configure_notif = () => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
        const tokenConf = token.token;
        console.log('tokencong', tokenConf);
        setConfigureToken(tokenConf);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log('NOTIFICATION on notifs:', notification);

        // process the notification

        if (typeof this._onNotification === 'function') {
          setTimeout(() => {
            this._onNotification(notification);
          }, 3000);

          // this._onNotification(notification);
        }
        // (required) Called when a remote is received or opened, or local notification is opened
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // setTimeout(() => {

        //   // setSpinner(false);
        // }, 3000);

        if (notification.action === 'Yes') {
          setTimeout(() => {
            PushNotification.invokeApp(notification);
          }, 3000);
        }
        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  };

  const kliknotif = () => {
    configure_notif();
    console.log('klik notifs');
    console.log('configureToken', configureToken);

    let headers = {
      'Content-Type': 'application/json',
      //hardcode
      Authorization:
        'key=AAAAeYlrdr0:APA91bFokl9dlfzGtdbK-VTcQ7IOHiCifd4Vu9-T1D0tcSZWs1RBDkcoBQdpERlAMP2etN7jZ0D8woPcuCXQPLAbAPGlTohBfsL6a1OozjuOmd_PGt0hTqP2JOxOkeEqNWvQKeJl8ap-',
    };

    const body = {
      //to : hasil dari token yang beda2 disetiap device
      to: configureToken,
      priority: 'high',
      soundName: 'default',
      notification: {
        title: 'Pakubuwono Residence',
        body: 'Your ticket has been Submited. This is your Ticket Number # 123123123',
      },
    };
    axios
      .post('https://fcm.googleapis.com/fcm/send', body, {
        headers,
      })
      .then(res => {
        console.log('res', res.data);
        // const datas = res.data;
        // const dataDebtors = datas.Data;
        // setDataDebtor(dataDebtors);

        // return res.data;
      })
      .catch(error => {
        console.log('error get tower api', error.response);
        alert('error get');
      });
  };

  async function fetchDataDue() {
    try {
      const res = await axios.get(
        `http://34.87.121.155:2121/apiwebpbi/api/getDataDue/IFCAPB/${user.user}`,
      );
      setDataDue(res.data.Data);
      console.log('data', getDataDue);
    } catch (error) {
      setErrors(error.ressponse.data);
      alert(hasError.toString());
    }
  }

  const galery = [...data];

  //TOTAL
  const sum = getDataDue.reduceRight((max, bills) => {
    return (max += parseInt(bills.mbal_amt));
  }, 0);
  console.log('sum', sum);

  //LENGTH
  const onSelect = indexSelected => {};

  const unique = [...new Set(getDataDue.map(item => item.doc_no))];
  console.log('sumss', unique);

  const invoice = unique.length;

  useEffect(() => {
    console.log('galery', galery);

    console.log('datauser', user);
    console.log('about', data);
    setTimeout(() => {
      fetchDataDue();
      // fetchAbout();
      setLoading(false);
    }, 1000);
  }, []);

  const goPostDetail = item => () => {
    navigation.navigate('PostDetail', {item: item});
  };

  const renderContent = () => {
    const mainNews = PostListData[0];

    return (
      <SafeAreaView
        style={[BaseStyle.safeAreaView, {flex: 1}]}
        edges={['right', 'top', 'left']}>
        <HeaderHome />
        <ScrollView
          contentContainerStyle={styles.paddingSrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Image
            source={require('../../assets/images/pakubuwono.png')}
            style={{
              height: 60,
              width: 180,
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 80,
              marginBottom: 15,
              marginTop: -15,
              flexDirection: 'row',
            }}
          />
          <View>
            <Swiper
              dotStyle={{
                backgroundColor: BaseColor.dividerColor,
                marginBottom: 8,
              }}
              activeDotStyle={{
                marginBottom: 8,
              }}
              paginationStyle={{bottom: 0}}
              loop={false}
              style={{height: ((Utils.getWidthDevice() - 30) * 3) / 6}}
              activeDotColor={colors.primary}
              removeClippedSubviews={false}
              onIndexChanged={index => onSelect(index)}>
              {data.map((item, key) => {
                return (
                  <Image
                    key={key}
                    style={{
                      flex: 1,
                      width: '100%',
                      borderRadius: 10,
                    }}
                    source={{uri: item.pict}}
                  />
                );
              })}
            </Swiper>
          </View>

          <Button onPress={() => kliknotif()} title={'klik notif'}></Button>

          {/* <News43
            loading={loading}
            onPress={goPostDetail(mainNews)}
            style={{marginTop: 1}}
            title={mainNews.title}
          /> */}
          <View style={{flexDirection: 'row', marginVertical: 15}}>
            <View style={{flex: 1, paddingRight: 7}}>
              <CardReport06
                icon="arrow-up"
                title="Invoice Due"
                // price="$0.68"
                percent={invoice}
                onPress={() => navigation.navigate('Billing')}
              />
            </View>
            <View style={{flex: 1, paddingLeft: 7}}>
              <CardReport06
                style={{backgroundColor: BaseColor.kashmir}}
                icon="arrow-up"
                title="Total"
                // price="$0.68"
                percent={numFormat(sum)}
                onPress={() => navigation.navigate('Billing')}
              />
            </View>
          </View>
          <View style={styles.paddingContent}>
            <Categories style={{marginTop: 10}} />
          </View>
          {/* {loading ? renderPlaceholder() : renderContent()} */}
        </ScrollView>
      </SafeAreaView>
    );
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'top', 'left']}>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
};

export default Home;
