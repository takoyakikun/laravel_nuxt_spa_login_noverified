<?php

namespace App\Auth\Passwords;

use Illuminate\Auth\Passwords\PasswordResetServiceProvider;
use App\Auth\Passwords\CustomPasswordBrokerManager;

class CustomPasswordResetServiceProvider extends PasswordResetServiceProvider
{
    /**
     * PasswordBrokerManagerを独自処理に変更
     *
     * @return void
     */
    protected function registerPasswordBroker()
    {
        $this->app->singleton('auth.password', function ($app) {
            return new CustomPasswordBrokerManager($app);
        });

        $this->app->bind('auth.password.broker', function ($app) {
            return $app->make('auth.password')->broker();
        });
    }
}