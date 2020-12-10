<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\CustomVerifyEmail;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Facades\Notification;

class MyuserTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    public function setUp(): void
    {
        parent::setUp();

        // テストユーザ作成
        $this->user = factory(User::class)->create();
    }

    /**
     * ユーザー追加テスト
     *
     * @return void
     */
    public function testStore()
    {
        // 実際にメール送信しないようにする
        Notification::fake();

        // 追加するデータ
        $newData = [
            'name'  => 'テスト',
            'email' => 'test@test.com',
            'password' => 'password',
            'password_confirmation' => 'password'
        ];

        // ユーザー追加リクエストを送信
        $response = $this->json('POST', route('register'), $newData, ['X-Requested-With' => 'XMLHttpRequest']);

        // 正しいレスポンスが返ってくることを確認
        $response->assertStatus(200);

        // データベースに追加したユーザーデータが入っているか確認
        $this->assertDatabaseHas('users', [
            'name'  => $newData['name'],
            'email' => $newData['email'],
        ]);

        // データベースにパスワード設定時刻が入っているか確認
        $user = User::orderBy('id', 'desc')->first();
        $this->assertNotNull($user->password_set_at);
    }

    /**
     * ユーザー編集テスト
     *
     * @return void
     */
    public function testUpdate()
    {
        // actingAsヘルパで現在認証済みのユーザーを指定する
        $actingAs = $this->actingAs($this->user);

        // 追加するデータ
        $newData = [
            'name'  => 'テスト編集',
            'email' => 'test_edit@test.com',
        ];

        // ユーザー編集リクエストを送信
        $response = $actingAs->json('PATCH', route('myuser.update'), $newData, ['X-Requested-With' => 'XMLHttpRequest']);

        // 正しいレスポンスが返ってくることを確認
        $response->assertStatus(200);

        // データベースに編集したユーザーが入っているか確認
        $this->assertDatabaseHas('users', $newData);

    }

    /**
     * パスワード変更テスト
     *
     * @return void
     */
    public function testPasswordChange()
    {
        // actingAsヘルパで現在認証済みのユーザーを指定する
        $actingAs = $this->actingAs($this->user);

        // 追加するデータ
        $newData = [
            'current_password' => 'password',
            'password' => 'changepass',
            'password_confirmation' => 'changepass'
        ];

        // ユーザー編集リクエストを送信
        $response = $actingAs->json('PATCH', route('myuser.passwordChange'), $newData, ['X-Requested-With' => 'XMLHttpRequest']);

        // 正しいレスポンスが返ってくることを確認
        $response->assertStatus(200);

        // 再度ログインして確認するために一旦ログインする
        $actingAs->json('POST', route('logout'), [], ['X-Requested-With' => 'XMLHttpRequest']);

        // 変更したパスワードで認証リクエスト
        $loginResponse = $actingAs->json('POST', route('login'), [
            'email' => $this->user->email, 'password' => $newData['password']
        ], ['X-Requested-With' => 'XMLHttpRequest']);

        // 正しいレスポンスが返ってくることを確認
        $loginResponse->assertStatus(200);

    }
}
