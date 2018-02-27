export default ( classA, classB ) => {
    
    const mapingExports = {
        ...classB,
        childContextTypes: classA.childContextTypes,
        displayName: classA.displayName,
        propTypes: classA.propTypes,
        defaultProps: classA.defaultProps,
        toString: classA.toString,
        getInitialState: classA.getInitialState,
        contextTypes: classA.contextTypes,
        getChildContext: classA.getChildContext,
        childContextTypes: classA.childContextTypes
    };

    return Object.assign(classA, mapingExports);
};