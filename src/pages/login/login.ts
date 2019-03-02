import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, LoadingController, Loading, } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading;
  registerCredentials = { username: '', password: '' };
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
      private auth: AuthServiceProvider, private loadingCtrl: LoadingController,
      private alertCtrl: AlertController, private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  public login() {
    this.showLoading()
    this.auth.login(this.registerCredentials).subscribe(response => {
      if (response && response.key) {
        this.storage.set('key', response.key)
        this.navCtrl.setRoot('TabsPage');
      } else {
        this.showError("Access Denied");
      }
    },
      error => {
        this.showError(error);
      });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    this.loading.dismiss();
 
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(alert);
  }
}
