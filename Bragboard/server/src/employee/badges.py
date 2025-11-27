def get_badges(sent,received,tagged):
    badges=[]
    if sent>=10: badges.append("Top Sender")
    if received>=15: badges.append("Highly Appreciated")
    if tagged>=20: badges.append("Star of the Team")
    return badges
