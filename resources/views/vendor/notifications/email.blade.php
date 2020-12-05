@component('mail::message')
{{-- Greeting --}}
@if (! empty($greeting))
# {{ $greeting }}
@else
@if ($level == 'error')
# Whoops!
@else
# こんにちは。
@endif
@endif

{{-- Intro Lines --}}
@foreach ($introLines as $line)
{{ $line }}

@endforeach

{{-- Action Button --}}
@isset($actionText)
<?php
    switch ($level) {
        case 'success':
            $color = 'green';
            break;
        case 'error':
            $color = 'red';
            break;
        default:
            $color = 'blue';
    }
?>
@component('mail::button', ['url' => $actionUrl, 'color' => $color])
{{ $actionText }}
@endcomponent
@endisset

{{-- Outro Lines --}}
@foreach ($outroLines as $line)
{{ $line }}

@endforeach

{{-- Salutation --}}
@if (! empty($salutation))
{{ $salutation }}
@else
{{ config('app.name') }} より
@endif

{{-- Subcopy --}}
@isset($actionText)
@component('mail::subcopy')
もし、「{{ $actionText }}ボタン」がうまく機能しない場合、以下のURLをコピー＆ペーストして直接ブラウザからアクセスしてください。
 [{{ $actionUrl }}]({{ $actionUrl }})
@endcomponent
@endisset
@endcomponent
