<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Auth\Notifications\ResetPassword;

class CustomResetPassword extends ResetPassword
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        if (\Config::get('temporary.passwordSet')) {
            return (new MailMessage)
                ->subject('パスワードを設定してください')
                ->line('下のボタンをクリックしてパスワードを設定してください。')
                ->action('パスワード設定', url('passwordSet/' . $this->token))
                ->line('もし、「パスワード設定」がうまく機能しない場合、以下のURLをコピー＆ペーストして直接ブラウザからアクセスしてください。');
        } else {
            return (new MailMessage)
                ->subject(__('Reset Password'))
                ->line(__('Click button below and reset password.'))
                ->action(__('Reset password'), url('passwordReset/' . $this->token))
                ->line(__('If you did not request a password reset, no further action is required.'));
        }
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
