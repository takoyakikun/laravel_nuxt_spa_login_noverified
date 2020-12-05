<?php

use Illuminate\Database\Seeder;
use App\Models\User;

class UserTestTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(User::class)->states('test_system')->create(); // 開発者
        factory(User::class)->states('test_admin')->create(); // 管理者
        factory(User::class)->states('test_user')->create(); // 一般
    }
}
