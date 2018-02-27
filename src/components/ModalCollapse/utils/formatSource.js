
const formatItem = ( item: Object = {}, multiple: Boolean = false, isTranslate: Boolean = false ) => {

    if( item.children && Array.isArray( item.children ) ) {

        item.children = formatSource( item.children, true, isTranslate );
    }
    item.multiple = multiple;

    isTranslate = item.hasOwnProperty('translate') ? item.translate : isTranslate;

    if( isTranslate && !item.isSearch ) {

        item.label = translate( item.label );
    }

    return item;
};

const formatSource = ( source: Array = [], multiple: Boolean = false, isTranslate: Boolean = false ) => {

    source = source.map( item => {

        return formatItem( item, item.hasOwnProperty('isMulti') ? item.isMulti : multiple, isTranslate );
    } );
    return source;
};

export default formatSource;