<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\CustomVerifyEmail;
use App\Notifications\CustomResetPassword;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Facades\Notification;
use PHPUnit\Framework\Assert;

class AuthenticationTest extends TestCase
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
     * ログイン認証テスト
     */
    public function testLogin(): void
    {
        // 作成したテストユーザのemailとpasswordで認証リクエスト
        $response = $this->json('POST', route('login'), [
            'email' => $this->user->email,
            'password' => 'password',
        ], ['X-Requested-With' => 'XMLHttpRequest']);

        // 正しいレスポンスが返り、ユーザ名が取得できることを確認
        $response
            ->assertStatus(200)
            ->assertJson(['name' => $this->user->name]);

        // 指定したユーザーが認証されていることを確認
        $this->assertAuthenticatedAs($this->user);
    }

    /**
     * ログアウトテスト
     */
    public function testLogout(): void
    {
        // actingAsヘルパで現在認証済みのユーザーを指定する
        $actingAs = $this->actingAs($this->user);

        // ログアウトページへリクエストを送信
        $response = $actingAs->json('POST', route('logout'), [], ['X-Requested-With' => 'XMLHttpRequest']);

        // ログアウト後のレスポンスで、HTTPステータスコードが正常であることを確認
        $response->assertStatus(200);

        // ユーザーが認証されていないことを確認
        $this->assertGuest();
    }

    /**
     * ユーザー取得テスト
     */
    public function testUser(): void
    {
        // actingAsヘルパで現在認証済みのユーザーを指定する
        $actingAs = $this->actingAs($this->user);

        // ユーザー取得リクエストを送信
        $response = $actingAs->json('GET', route('user'), [], ['X-Requested-With' => 'XMLHttpRequest']);

        // 正しいレスポンスが返り、ユーザ名が取得できることを確認
        $response
            ->assertStatus(200)
            ->assertJson(['name' => $this->user->name]);

        // 指定したユーザーが認証されていることを確認
        $this->assertAuthenticatedAs($this->user);

    }

    /**
     * パスワードリセットテスト
     *
     * @return void
     */
    public function testPasswordReset()
    {
        // 実際にメール送信しないようにする
        Notification::fake();

        // サンプルデータを追加
        $user = factory(User::class)->create([
            'email' => 'sample@test.com',
        ]);

        // パスワードリセットメール送信のリクエストを送信
        $response = $this->json('POST', route('password.email'), ['email' => $user->email], ['X-Requested-With' => 'XMLHttpRequest']);

        // 正しいレスポンスが返ってくることを確認
        $response->assertStatus(200);

        // パスワードリセットメールが入力されたメールアドレスに送信されているか確認
        $token = '';
        $actionUrl = '';
        Notification::assertSentTo(
            $user,
            CustomResetPassword::class,
            function (CustomResetPassword $notification) use (&$token, &$actionUrl, $user) {
                $actionUrl = $notification->toMail($user)->actionUrl;
                $token = $notification->token;
                return true;
            }
        );

        // 送信されたメールのボタンリンクがパスワードリセットのURLになっているか
        Assert::assertSame($actionUrl, url('passwordReset/' . $token));

        // 変更するパスワードデータ
        $newPasswordData = [
            'token'  => $token,
            'email' => $user->email,
            'password' => 'resetpass',
            'password_confirmation' => 'resetpass'
        ];

        // パスワードリセットのリクエストを送信
        $response = $this->json('POST', route('password.update'), $newPasswordData, ['X-Requested-With' => 'XMLHttpRequest']);

        // 正しいレスポンスが返ってくることを確認
        $response->assertStatus(200);

        // 認証されていることを確認
        $this->assertTrue(\Auth::check());

        // 変更されたパスワードが保存されていることを確認
        $this->assertTrue(\Hash::check($newPasswordData['password'], $user->fresh()->password));

    }

}
