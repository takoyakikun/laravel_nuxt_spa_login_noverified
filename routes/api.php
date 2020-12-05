<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// ログイン
Route::post('login', 'Auth\LoginController@login')->name('login');

// ログアウト
Route::post('logout', 'Auth\LoginController@logout')->name('logout');

// ユーザー追加
Route::post('register', 'MyuserController@store')->name('register');

// ユーザーを取得
Route::get('/user', function () {
    if (Gate::allows('user-higher')) {
        return Auth::user();
    }
})->name('user');

// ユーザーのメールアドレスがユニークかの判定を取得
Route::post('users/unique', 'UsersController@unique')->name('users.unique');

// パスワードリセットメール送信
Route::post('password/email', 'Auth\ForgotPasswordController@sendResetLinkEmail')->name('password.email');

// パスワードリセット
Route::post('password/reset', 'Auth\ResetPasswordController@reset')->name('password.update');

// パスワードセット
Route::post('password/passwordSet', 'Auth\ResetPasswordController@passwordSet')->name('password.passwordSet');

// コンフィグを取得
Route::get('/config', 'ConfigController@index')->name('config');

// 全ユーザ
Route::group(['middleware' => ['auth', 'can:user-higher']], function () {

    // アクセス権限のチェック
    Route::get('permission/{category}', function ($category) {
        return response([Gate::allows($category)]);
    })->name('permission');

    // ユーザー認証メール再送信
    Route::post('email/resend', 'Auth\VerificationController@resend')->name('verification.resend');

    // 認証済
    Route::group(['middleware' => ['verified']], function () {
        // ユーザー編集
        Route::patch('myuser/update', 'MyuserController@update')->name('myuser.update');

        // パスワード変更
        Route::patch('myuser/passwordChange', 'MyuserController@passwordChange')->name('myuser.passwordChange');
    });

});

// 管理者以上
Route::group(['middleware' => ['auth', 'can:admin-higher']], function () {
    // 認証済
    Route::group(['middleware' => ['verified']], function () {
        // ログインユーザー
        Route::resource('users', 'UsersController', ['only' => ['index', 'store', 'update', 'destroy']]);

        // 権限の選択オプション
        Route::get('users/roleOptions', 'UsersController@roleOptions')->name('users.roleOptions');
    });

});

// 開発者のみ
Route::group(['middleware' => ['auth', 'can:system-only']], function () {

});
