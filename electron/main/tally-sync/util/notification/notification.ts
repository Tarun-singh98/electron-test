

export const sendNotification = async (expoToken: any, title: any, body: any) => {
    try {
        if (expoToken.length !== 0) {
            const tokens = expoToken.map((tokenObj: any) => tokenObj.token);

            const message = {
                to: tokens,
                sound: 'default',
                title: title,
                body: body,
                data: { someData: 'goes here' },
            };

            const response = await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });

            const data = await response.json();

            return { code: 200, data }
        } else {
            return {
                code: 400,
                msg: "User not found."
            }
        }
    } catch (error: any) {
        return {
            code: 500,
            msg: error.message
        }
    }
};