"use strict";
import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import SectionBox from '~/components/SectionBox';
import { sizes, fontSizes, colors } from '~/configs/styles';
import LocationItem from './LocationItem';

class SearchHistory extends React.PureComponent {

    static displayName = "@SearchHistory";

    static propTypes = {
    };

    static defaultProps = {
    };

    render() {

        return (
            <SectionBox style={_styles.container}>
                <Text style={_styles.title}>{`${translate("maps.search_history")}`.toUpperCase()}</Text>
                <LocationItem />
                <LocationItem />
                <LocationItem />
                <LocationItem />
                <LocationItem />
                <LocationItem />
                <LocationItem />
                <LocationItem />
                <LocationItem />
            </SectionBox>
        );
    }
}

const _styles = {
    container: {
        marginHorizontal: sizes.margin
    },
    title: {
        color: colors.textItalicColor,
        fontSize: fontSizes.large,
        marginLeft: sizes.margin,
        marginVertical: sizes.margin
    }
};

export default SearchHistory;