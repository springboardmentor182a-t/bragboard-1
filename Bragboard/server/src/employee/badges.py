def get_badges(sent, received, tagged, reactions_earned=0, comments_written=0, tenure_days=0, role="employee"):
    """
    Badge system based on contribution, impact, engagement and seniority.
    """

    badges = []

    if sent >= 20:
        badges.append("Top Sender")
    elif sent >= 10:
        badges.append("Active Sender")
    elif sent >= 5:
        badges.append("Rising Contributor")

    if received >= 40:
        badges.append("Most Valued Star")
    elif received >= 25:
        badges.append("Highly Recognized")
    elif received >= 10:
        badges.append("Appreciated Team Member")

    if tagged >= 30:
        badges.append("Tag Magnet")
    elif tagged >= 15:
        badges.append("Team Favorite")

    if reactions_earned >= 150:
        badges.append("Crowd Puller")
    elif reactions_earned >= 50:
        badges.append("Reaction Collector")

    if comments_written >= 100:
        badges.append("Voice of Appreciation")
    elif comments_written >= 20:
        badges.append("Active Communicator")

    if tenure_days >= 365:
        badges.append("Loyal Legend")
    elif tenure_days >= 180:
        badges.append("Committed Member")

    if role in ["admin", "manager"]:
        badges.append("Team Leader")
        if sent >= 30:
            badges.append("Inspiring Leader")
        if received >= 25:
            badges.append("Respected Leader")

    if role == "manager" and tenure_days > 400:
        badges.append("Leadership Spotlight")

    return badges
