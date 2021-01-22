//import liraries
import React, { Component, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import WebView from 'react-native-webview';
import { connect } from 'react-redux';
import {ThemedView, Header} from 'src/components';
import {TextHeader, IconHeader} from 'src/containers/HeaderComponent';
import { mainStack } from '../../../config/navigator';
import { authSelector, shippingAddressSelector, userSelector } from '../../../modules/auth/selectors';
import { cartSelector, cartTotalSelector } from '../../../modules/cart/selectors';

// create a component
const Credit = (props) => {
    const {user, shippingAddress} = props;
    const refGForm = useRef(null)
    const [loading, setLoading] = useState(true)
    const [url, setUrl] = useState(`https://docs.google.com/forms/d/e/1FAIpQLSf7xBjv_GQubUHkvrewUvb1NhcGsty7tDi_fj5VLf_D_KoI2A/viewform?usp=sf_link&entry.1182562155=${user.display_name}&entry.900887411=${user.user_email}&entry.22132426=${shippingAddress.phone}&entry.540037891=${shippingAddress.address_1}`)
    const handleResponse = (req) => {
        if (req.url.includes('formResponse')) {
            props.navigation.navigate(mainStack.thankyou)
        }
    }
    const handleGoBack = () => {
        props.navigation.goBack();
    }
    const run = `
    document.getElementsByClassName("freebirdFormviewerViewFooterDisclaimer")[0].style.display = "none";
    document.getElementsByClassName("freebirdFormviewerViewHeaderHeader")[0].style.display = "none";
    document.getElementsByClassName("freebirdFormviewerViewNavigationPasswordWarning")[0].style.display = "none";
    document.getElementsByClassName("freebirdFormviewerViewFooterImageContainer")[0].style.display = "none";
    document.getElementsByClassName("freebirdFormviewerViewFeedbackSubmitFeedbackButton")[0].style.display = "none";
    true;
    `
    return (
        <ThemedView isFullView>
            <Header
                leftComponent={<IconHeader onPress={handleGoBack} />}
                centerComponent={
                <TextHeader
                    title="Credit Form"
                />
                }
            />
            <View style={styles.container}>
                <Spinner visible={loading} color="#000" overlayColor="#fff" />
                <WebView 
                    ref={refGForm}
                    style={{flex: 1, marginVertical: 20, width: Dimensions.get('window').width}}
                    onNavigationStateChange={handleResponse}
                    onLoadEnd={() => setLoading(false)}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    injectedJavaScript={run}
                    source={{uri: url}} />
            </View>
        </ThemedView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingView: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    }
});

const mapStateToProps = (state) => ({
    // count: countItemSelector(state),
    // loading: loadingItemSelector(state),
    // loadingRemove: loadingRemoveItemSelector(state),
    // loadingUpdate: loadingUpdateQuantitySelector(state),
    data: cartSelector(state).toJS(),
    totals: cartTotalSelector(state).toJS(),
    user: userSelector(state).toJS(),
    shippingAddress: shippingAddressSelector(state).toJS(),
    // configs: configsSelector(state).toJS(),
    // siteConfigs: getSiteConfig(state).toJS(),
    // wishList: wishListSelector(state).toJS(),
    // currency: currencySelector(state),
    // isLogin: isLoginSelector(state),
  });
//make this component available to the app
export default connect(mapStateToProps, null)(Credit);