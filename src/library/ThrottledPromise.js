/**
 * @todo hàm hỗ trợ timeout cho async
 * @author Croco
 * @since 28-2-2018
 */
export default (handler, period = 3000) => {

    return (...args) => {

        return new Promise( ( resolve, reject ) => {

            const waiting = handler(...args);
            var timeID = setTimeout(() => {

                reject(new Error("Promise timeout"))
            }, period );

            waiting.then(result => resolve(result))
                    .catch(error => reject(error))
            ;

            waiting.finally( () => {

                if(timeID) {

                    clearTimeout(timeID);
                }
            } );
        } );
    };
};