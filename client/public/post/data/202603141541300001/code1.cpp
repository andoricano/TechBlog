#include <cstdio>
#include <vector>
#include <cmath>

using namespace std;

int trash(int n, vector<vector<int>> &v) {
    if (n == 0) return 0;
    
    vector<vector<int>> dp(2, vector<int>(n + 1, 0));

    dp[0][1] = v[0][0];
    dp[1][1] = v[1][0];

    for (int i = 2; i <= n; i++) {
        dp[0][i] = max(dp[1][i - 1], dp[1][i - 2]) + v[0][i - 1];
        dp[1][i] = max(dp[0][i - 1], dp[0][i - 2]) + v[1][i - 1];
    }

    return max(dp[0][n], dp[1][n]);
}

int main()
{
    int n;
    scanf("%d", &n);
    while(n --){
        int a;
        scanf("%d",&a);
        vector<vector<int>> v(2,vector<int>(a));
        
        for(int i = 0 ; i < a ; i ++){
            scanf("%d",&v[0][i]);
        }
        
        for(int i = 0 ; i < a ; i ++){
            scanf("%d",&v[1][i]);
        }

        printf("%d\n",trash(a,v));
    }
}