<?php

namespace Tests\Feature\Commands;

use Tests\Feature\Common\UserTestTrait;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Facades\Notification;

class UserCreateTest extends TestCase
{
    use RefreshDatabase;
    use UserTestTrait;

    /**
     * ログインユーザー追加コマンドテスト
     *
     * @return void
     */
    public function testHandle()
    {
        // 実際にメール送信しないようにする
        Notification::fake();

        // 追加するデータ
        $newData = [
            'name'  => 'テスト',
            'login_id' => 'sample@test.com',
            'role' => 3
        ];

        // コマンドを実行
        $this->artisan('command:user-create', [
            'name' => $newData['name'],
            'login_id' => $newData['login_id'],
            'role' => $newData['role'],
        ])->expectsOutput($newData['name'] . '(' . $newData['login_id'] . ') を追加しました。');

        // データベースに追加したユーザーデータが入っているか確認
        $this->assertDatabaseHas('users', [
            'name'  => $newData['name'],
            'login_id' => $newData['login_id'],
            'role' => $newData['role']
        ]);

        // ログインユーザーパスワード設定メール送信共通のテスト
        $this->userPasswordSetMail();

    }

}
