<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */
use App\Models\User;
use Faker\Generator as Faker;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(User::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'login_id' => $faker->unique()->safeEmail,
        'login_id_verified_at' => now(),
        'password_set_at' => now(),
        'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        'role' => 3, // 一般ユーザー
        'remember_token' => Str::random(10),
    ];
});

$factory->state(User::class, 'test_system', function (Faker $faker) {
    return [
        'name' => 'テスト開発者',
        'login_id' => 'test@test.com',
        'role' => 1, // 開発者
    ];
});

$factory->state(User::class, 'test_admin', function (Faker $faker) {
    return [
        'name' => 'テスト管理者',
        'login_id' => 'test_admin@test.com',
        'role' => 2, // 管理者
    ];
});

$factory->state(User::class, 'test_user', function (Faker $faker) {
    return [
        'name' => 'テスト一般',
        'login_id' => 'test_user@test.com',
        'role' => 3, // 一般
    ];
});
