import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataService } from './data.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { LocalePage } from './locale/locale.page';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { JsonpModule } from '@angular/http';
import { Network } from '@ionic-native/network/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SettingAboutPage } from './setting-about/setting-about.page';
import { Globalization } from '@ionic-native/globalization/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { SettingsPage } from './settings/settings.page';
import { FormsModule } from '@angular/forms';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@NgModule({
    //schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [
        AppComponent,
        LocalePage,
        SettingAboutPage,
        SettingsPage,
    ],
    entryComponents: [
        LocalePage,
        SettingAboutPage,
        SettingsPage,
    ],
    imports: [
        BrowserModule, 
        IonicModule.forRoot(), 
        AppRoutingModule,
        HttpClientModule,
        JsonpModule,
        NgxWebstorageModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        FormsModule,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { 
            provide: RouteReuseStrategy, useClass: IonicRouteStrategy 
        },
        AppVersion,
        DataService,
        LocalNotifications,
        Network,
        InAppBrowser,
        AppRate,
        Globalization,
        AndroidPermissions,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
