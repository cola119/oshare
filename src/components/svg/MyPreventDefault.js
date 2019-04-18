import React from 'react';

class MyPreventDefault extends React.Component {
    componentWillMount() {
        const EVENTS_TO_MODIFY = ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'wheel'];

        const originalAddEventListener = document.addEventListener.bind();
        document.addEventListener = (type, listener, options, wantsUntrusted) => {
            let modOptions = options;
            if (EVENTS_TO_MODIFY.includes(type)) {
                if (typeof options === 'boolean') {
                    modOptions = {
                        capture: options,
                        passive: false,
                    };
                } else if (typeof options === 'object') {
                    modOptions = {
                        ...options,
                        passive: false,
                    };
                }
            }

            return originalAddEventListener(type, listener, modOptions, wantsUntrusted);
        };

        const originalRemoveEventListener = document.removeEventListener.bind();
        document.removeEventListener = (type, listener, options) => {
            let modOptions = options;
            if (EVENTS_TO_MODIFY.includes(type)) {
                if (typeof options === 'boolean') {
                    modOptions = {
                        capture: options,
                        passive: false,
                    };
                } else if (typeof options === 'object') {
                    modOptions = {
                        ...options,
                        passive: false,
                    };
                }
            }
            return originalRemoveEventListener(type, listener, modOptions);
        };
    }

    render() {
        return null;
    }
}

export default MyPreventDefault;