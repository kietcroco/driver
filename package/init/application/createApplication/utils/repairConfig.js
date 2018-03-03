import applicationDefaultConfig from '../configs/application';
import cachesDefaultConfig from '../configs/caches';
import aliasDefaultConfig from '../configs/alias';
import splashScreenDefaultConfig from '../configs/splashScreen';
import i18nDefaultConfig from '../configs/i18n';
import codePushDefaultConfig from '../configs/codePush';
import CodePush from "react-native-code-push";

export default ( configs = {} ) => {

	return {
		application: {
			...applicationDefaultConfig,
			...configs.application
		},
		caches: {
			...cachesDefaultConfig,
			...configs.caches
		},
		alias: {
			...aliasDefaultConfig,
			...configs.alias
		},
		splashScreen: {
			...splashScreenDefaultConfig,
			...configs.splashScreen
		},
		i18n: {
			...i18nDefaultConfig,
			...configs.i18n
		},
		codePush: {
			...codePushDefaultConfig,
			installMode: CodePush.InstallMode.IMMEDIATE, 
		    mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
			updateDialog: (updateDialog = {}) => {

				const I18n = app('I18n');
				return {
					...updateDialog,
					title: I18n.translate("updater.update_available"),
                    optionalUpdateMessage: I18n.translate("updater.optional_update_message"),
                    mandatoryUpdateMessage: I18n.translate("updater.mandatory_update_message"),
                    optionalInstallButtonLabel: I18n.translate("updater.optional_install_buttonLabel"),
                    optionalIgnoreButtonLabel: I18n.translate("updater.optional_ignore_button_label"),
                    mandatoryContinueButtonLabel: I18n.translate("updater.mandatory_continue_button_label"),
                    appendReleaseDescription: false,
                    descriptionPrefix: I18n.translate("updater.description_prefix")
				}
			},
			...configs.codePush
		}
	};
};