(function() {

  function initialProgress() {
    const progress = $('.progress'),
          progressBar = $(progress).find('.progress__bar'),
          progressBarLine = $(progress).find('.progress__bar-line'),
          progressValMax = $(progressBarLine).data('value-max'),
          progressTarget = $(progress).find('.progress__target');

    let progressValCurrent = $(progressBarLine).data('value');

    function balanceIncreaseAnimation(value, time, step = 1) {
      let balanceIncrease = setInterval(() => {

        // Pretty float number
        progressValCurrent = (Number(progressValCurrent) + step).toFixed(1);
        if (progressValCurrent.split('.')[1] == 0) {
          progressValCurrent = Number(progressValCurrent.split('.')[0]);
        };

        // Style progress bar-line and set data-value attribute
        $(progressBarLine).css('width', `${(progressValCurrent*100)/progressValMax}%`);
        $(progressBarLine).attr('data-value', progressValCurrent);

        if (progressValCurrent >= value || progressValCurrent >= progressValMax) {

          // Reached the target
          if (value != progressValMax) {
            balanceIncreaseAnimation(progressValMax, 2000, .2);
          } else {
            $(progressTarget).addClass('target_finish');
            $('.indicator__info').addClass('hidden');
          };

          // Stop interval operation
          clearInterval(balanceIncrease);
          return false;
        }
      }, time)
    }

    // Ajax
    $.ajax({
      url: 'http://alex.devel.softservice.org/testapi/',
      success: (data) => {
        let balance = data.balance_usd;

        // If balance value is greater than progress bar max value - throw error
        if (balance > progressValMax) {
          console.error(`${balance} - Incorrect balance value`);
          return false;
        }

        balanceIncreaseAnimation(balance, 100)
      },

      // Ajax error handling
      error: (XMLHttpRequest, textStatus) => {
        alert(`${textStatus}: Balance value not loaded`)
      }
    });
  }

  initialProgress();

})();
