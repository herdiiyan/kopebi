import React from 'react';
import {withTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {ThemedView, Header} from 'src/components';
import {IconHeader, TextHeader} from 'src/containers/HeaderComponent';

class LinkingWebviewKonfirmasiKredit extends React.Component {
  
  render() {
    const {t, route} = this.props;
    const url = route?.params?.url ?? '';
    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader />}
          centerComponent={<TextHeader title={t('common:text_link_webviewKonfirmasiKredit')} />}
        />
        {url ? <WebView 
        source={{uri: url}} 
        style={styles.webView}
        injectedJavaScript={run}
         /> : null}
      </ThemedView>
    );
  }
}

const run = `
    document.getElementById("masthead").style.display = "none";
    document.getElementById("wpadminbar").style.display = "none";
    document.getElementById("colophon").style.display = "none";
    true;
    `

const styles = StyleSheet.create({
  webView: {
    backgroundColor: 'transparent',
  },
});

export default withTranslation()(LinkingWebviewKonfirmasiKredit);
