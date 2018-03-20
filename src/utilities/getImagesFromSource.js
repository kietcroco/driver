export default (source: Object = {}) => {

    let images = [];

    if (source.images) {
        if (source.images && Array.isArray(source.images)) {

            source.images.forEach(value => {

                if (Array.isArray(value) && typeof value[0] === "string") {

                    images.push({
                        //FAKE
                        //source: String(value[0]).replace('izifix.com.local', 'api.izifix.com.local') || value[0],
                        //REAL 
                        source: value[0],
                        info: {

                        }
                    });
                }
            });
        }
    }
    
    return images;
};