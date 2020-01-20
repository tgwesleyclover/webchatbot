import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {ChatModule} from './chat/chat.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import {RouterModule, Routes} from '@angular/router';
import {OperatorChatComponent} from './chat/operator-chat/operator-chat.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AdminComponent} from './admin/admin.component';

const appRoutes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'operator', component: OperatorChatComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    ChatModule,
    BrowserAnimationsModule,
    MatTabsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
