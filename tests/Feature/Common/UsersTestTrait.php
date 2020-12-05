<?php

namespace Tests\Feature\Common;

use App\Models\User;
use App\Notifications\CustomResetPassword;

use Illuminate\Support\Facades\Notification;
use PHPUnit\Framework\Assert;

trait UsersTestTrait
{
    /**
     * ログインユーザーパスワード設定メール送信共通のテスト
     *
     * @return void
     */
    public function userPasswordSetMail()
    {
        // パスワード設定メールが入力されたメールアドレスに送信されているか確認
        $user = User::orderBy('id', 'desc')->first();
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

        // 送信されたメールのボタンリンクがパスワード設定URLになっているか
        Assert::assertSame($actionUrl, url('passwordSet/' . $token));

        // メール認証のアクセス権限のリクエストを送信
        $response = $this->actingAs($user)->json('GET', route('permission', ['verified']), [], ['X-Requested-With' => 'XMLHttpRequest']);

        // 正しいレスポンスが返ってくることを確認
        $response->assertStatus(200);

        // 設定するパスワードデータ
        $newPasswordData = [
            'token'  => $token,
            'email' => $user->email,
            'password' => 'password',
            'password_confirmation' => 'password'
        ];

        // パスワード設定のリクエストを送信
        $response = $this->json('POST', route('password.passwordSet'), $newPasswordData, ['X-Requested-With' => 'XMLHttpRequest']);

        // 正しいレスポンスが返ってくることを確認
        $response->assertStatus(200);

        // 設定されたパスワードが保存されていることを確認
        $this->assertTrue(\Hash::check($newPasswordData['password'], $user->fresh()->password));
    }

}
