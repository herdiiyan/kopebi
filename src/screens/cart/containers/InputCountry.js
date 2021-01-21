import React from 'react';
import {StyleSheet, FlatList, View, ActivityIndicator} from 'react-native';

import {withTranslation} from 'react-i18next';
import moment from 'moment';
import {connect} from 'react-redux';
import {compose} from 'redux';

import InputSelectValue from 'src/containers/input/InputSelectValue';
import Input from 'src/containers/input/Input';
import {SearchBar, Modal, ListItem} from 'src/components';

import {countrySelector} from 'src/modules/common/selectors';
import {fetchCountries} from 'src/modules/common/actions';

import {fromCharCode} from 'src/utils/string';
import {padding, margin} from 'src/components/config/spacing';

import province from '../../../mock/province.json';

class InputCountry extends React.Component {
  constructor(props, context) {
    super(props, context);
    const {country, value, city} = props;
    const countries = country.get('data').toJS();

    const selected = countries.find((data) => data.code === value);

    this.state = {
      visible: false,
      visibleState: false,
      visibleCity: false,
      search: '',
      states: selected && selected.states ? selected.states : [],
      citySelected: city ? city : null
    };
  }

  componentDidMount() {
    const {country, dispatch} = this.props;
    if (
      !country.get('expire') ||
      moment.unix(country.get('expire')).isBefore(moment())
    ) {
      dispatch(fetchCountries());
    }
  }
  componentDidUpdate(prevProps, prevState){
    if (this.props.city !== prevProps.city) {
      this.setState({citySelected: this.props.city})
    }
  }

  setModalVisible = (visible) => {
    this.setState({
      visible,
    });
  };

  setModalStateVisible = (visible) => {
    this.setState({
      visibleState: visible,
    });
  };

  setModalCityVisible = (visible) => {
    this.setState({
      visibleCity: visible,
    });
  };

  handleCountrySelect = (item) => {
    const {onChange, country} = this.props;

    const countries = country.get('data').toJS();
    const findCountry = countries.find((data) => data.code === item.code);

    const state =
      findCountry.states && findCountry.states[0]
        ? findCountry.states[0].code
        : '';
    this.setState({
      states: findCountry.states ? findCountry.states : [],
    });
    onChange('country', item.code);
    if (state.length > 0) {
      onChange('state', state);
    }

    this.setModalVisible(false);
  };
  handleStateSelect = (value) => {
    const {onChange} = this.props;
    onChange('state', value);
    this.setModalStateVisible(false);
  };

  handleCitySelect = (value) => {
    const {onChange} = this.props;
    onChange('city', value);
    this.setModalCityVisible(false);
  };

  updateSearch = (search) => {
    this.setState({search});
  };
  

  render() {
    const {visible, visibleState, search, states, citySelected, visibleCity} = this.state;
    const {label, value, country, error, state, t} = this.props;

    const countries = country.get('data').toJS();
    const loading = country.get('loading');

    const selected = countries.find((data) => data.code === value);

    const dataCountry = countries.filter(
      (data) => data.name.toLowerCase().indexOf(search.toLowerCase()) >= 0,
    );
    const findState = states.find((valueState) => valueState.code === state);
    const nameState = findState ? findState.name : '';

    const dataCity = province.prop.reduce((unique, o) => {
      if(!unique.some(obj => obj.kota_kabupaten === o.kota_kabupaten)) {
        unique.push(o);
      }
      return unique;
    },[]);
    console.log(dataCity.filter(e => e.province === nameState))

    
    return (
      <>
        <InputSelectValue
          onPress={() => this.setModalVisible(true)}
          label={label}
          value={selected ? fromCharCode(selected.name) : ''}
          error={error}
        />
        <View style={{marginTop: margin.base}}>
          {states.length > 0 ? (
            <InputSelectValue
              onPress={() => this.setModalStateVisible(true)}
              label={t('common:text_state')}
              value={nameState}
            />
          ) : (
            <Input
              label={t('common:text_state')}
              value={state}
              onChangeText={(valueState) => this.handleStateSelect(valueState)}
            />
          )}
        </View>
        <View style={{marginTop: margin.base}}>
            <InputSelectValue
              onPress={() => this.setModalCityVisible(true)}
              label={t('inputs:text_city')}
              value={citySelected}
            />
        </View>

        <Modal
          visible={visible}
          setModalVisible={this.setModalVisible}
          ratioHeight={0.7}
          underTopElement={
            <View style={styles.viewSearch}>
              <SearchBar
                cancelButton={false}
                placeholder={t('common:text_search_country_mobile')}
                onChangeText={this.updateSearch}
                value={search}
                platform="ios"
                onClear={() => this.setState({search: ''})}
                containerStyle={styles.search}
              />
            </View>
          }>
          <View
            style={{
              paddingHorizontal: padding.big,
              paddingBottom: padding.base,
            }}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <FlatList
                data={dataCountry}
                keyExtractor={(item) => item.code}
                renderItem={({item, index}) => (
                  <ListItem
                    onPress={() => this.handleCountrySelect(item)}
                    title={fromCharCode(item.name)}
                    type="underline"
                    activeOpacity={1}
                    rightIcon={
                      value === item.code
                        ? {
                            name: 'check',
                            size: 22,
                          }
                        : null
                    }
                    containerStyle={styles.item}
                  />
                )}
              />
            )}
          </View>
        </Modal>
        <Modal
          visible={visibleState}
          setModalVisible={this.setModalStateVisible}
          ratioHeight={0.5}>
          <View
            style={{
              paddingHorizontal: padding.big,
              paddingBottom: padding.base,
            }}>
            <FlatList
              data={states}
              keyExtractor={(item) => item.code}
              renderItem={({item, index}) => (
                <ListItem
                  onPress={() => this.handleStateSelect(item.code)}
                  title={fromCharCode(item.name)}
                  type="underline"
                  activeOpacity={1}
                  rightIcon={
                    state === item.code
                      ? {
                          name: 'check',
                          size: 22,
                        }
                      : null
                  }
                  containerStyle={styles.item}
                />
              )}
            />
          </View>
        </Modal>
        <Modal
          visible={visibleCity}
          setModalVisible={this.setModalCityVisible}
          ratioHeight={0.5}>
          <View
            style={{
              paddingHorizontal: padding.big,
              paddingBottom: padding.base,
            }}>
            <FlatList
              data={dataCity.filter(e => e.province === nameState)}
              keyExtractor={(item) => item.kota_kabupaten}
              renderItem={({item, index}) => (
                <ListItem
                  onPress={() => this.handleCitySelect(item.kota_kabupaten)}
                  title={fromCharCode(item.kota_kabupaten)}
                  type="underline"
                  activeOpacity={1}
                  containerStyle={styles.item}
                />
              )}
            />
          </View>
        </Modal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 0,
    paddingVertical: padding.large - 2,
  },
  viewSearch: {
    paddingHorizontal: padding.small + 1,
  },
  search: {
    paddingVertical: 0,
    paddingBottom: padding.small,
  },
});

const mapStateToProps = (state) => ({
  country: countrySelector(state),
});

export default compose(
  withTranslation(),
  connect(mapStateToProps),
)(InputCountry);
