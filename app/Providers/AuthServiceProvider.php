<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        // メール認証済
        Gate::define('verified', function ($user) {
            return ($user->hasVerifiedEmail());
        });
        // 開発者のみ許可
        Gate::define('system-only', function ($user) {
            return ((int)$user->role_level['auth'] === (int)\Config::get('role.roleLevel.auth.system'));
        });
        // 管理者以上（管理者＆開発者）に許可
        Gate::define('admin-higher', function ($user) {
            return ((int)$user->role_level['auth'] > 0 && (int)$user->role_level['auth'] <= (int)\Config::get('role.roleLevel.auth.admin'));
        });
        // 一般ユーザ以上（つまり全権限）に許可
        Gate::define('user-higher', function ($user) {
            return ((int)$user->role_level['auth'] > 0 && (int)$user->role_level['auth'] <= (int)\Config::get('role.roleLevel.auth.user'));
        });

    }
}
