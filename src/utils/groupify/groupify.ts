/* eslint-disable no-param-reassign */
export function groupify<GroupT>(
    total: { [key: string]: GroupT },
    initObj: GroupT,
    code: string | number,
): GroupT {
    let group = total[code];

    if (!group) {
        group = initObj;
        total[code] = group;
    }
    return group;
}
