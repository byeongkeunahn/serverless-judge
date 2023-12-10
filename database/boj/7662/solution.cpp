#include <bits/stdc++.h>
using namespace std;

int main() {
  size_t t;
  cin >> t;
  for (size_t i=0; i<t; i++) {
    multiset<int> s;
    size_t k;
    cin >> k;
    for (size_t j=0; j<k; j++) {
      char c;
      cin >> c;
      if (c == 'I') {
        int x;
        cin >> x;
        s.insert(x);
      } else /* c == 'D' */ {
        int op;
        cin >> op;
        if (!s.empty()) {
          if (op == 1) {
            s.erase(prev(s.end()));
          } else {
            s.erase(s.begin());
          }
        }
      }
    }
    if (s.empty()) {
      cout << "EMPTY\n";
    } else {
      cout << *s.rbegin() << " " << *s.begin() << "\n";
    }
  }
}