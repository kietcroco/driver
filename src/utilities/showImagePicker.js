import ImagePicker from 'react-native-image-picker';

export default async () => {

    return new Promise((resolve, reject) => {

        ImagePicker.showImagePicker({
            title: translate('image_picker.title'),
            cancelButtonTitle: translate('image_picker.cancel'),
            takePhotoButtonTitle: translate('image_picker.take'),
            chooseFromLibraryButtonTitle: translate('image_picker.library'),
            // customButtons: [
            //  {name: 'fb', title: 'Choose Photo from Facebook'},
            // ],
            cameraType: "back",
            mediaType: "photo",
            maxWidth: 1024,
            maxHeight: 768,
            quality: 0.8,
            //videoQuality: "high",
            //durationLimit: 60,
            //rotation: 0,
            allowsEditing: true,
            //noData: true,
            storageOptions: {
                skipBackup: true,
                path: "izifix",
                cameraRoll: true,
                waitUntilSaved: false
            },
            permissionDenied: {
                title: translate('image_picker.deny.title'),
                text: translate('image_picker.deny.text'),
                reTryTitle: translate('image_picker.deny.retry'),
                okTitle: "OK"
            }
        }, response => {
            //console.log('Response = ', response);

            // if ( response.didCancel ) {

            // 	console.log('User cancelled image picker');
            // }
            if (response.error) {

                return reject(response.error);
                console.log('ImagePicker Error: ', response.error);
            }
            return resolve(response);
            // if ( response.customButton ) {

            // 	console.log('User tapped custom button: ', response.customButton);
            // }
            //else {
            //let source = { uri: response.uri };

            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };

            // this.setState({
            // 	avatarSource: source
            // });
            //}
        });
    });
};