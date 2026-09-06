# Reservation summary card

One component, three callers: `/booking/confirmation/:reference`, `/lookup` and
`/account` all render the same block of reservation facts.

It is registered here as its own editable unit rather than as a dependency of
those three pages. An edit made from the account page would read as a local
change and would in fact rewrite what confirmation and lookup show — the kind
of surprise that only appears after the fact, because a type-check cannot see
it. Editing it here makes the reach explicit.

The labels and layout are project content and may change freely. The field
values come from the reservation record and must keep their meaning: reference,
dates, guest count, room name and total are what a guest checks the page for.
